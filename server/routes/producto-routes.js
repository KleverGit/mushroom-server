const express = require('express');
let app = express();
let Producto = require('../models/Producto');
const { verificarToken } = require('../middlewares/authentication');

/**
 * Obtiene todo el listado de productos
 * populate: usuario y categoria
 * paginado
 * desde se envia en la url ..?desde
 */
app.get('/productos', verificarToken, (req, res) => {
    // trae todos los productos
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    message: err
                });
            }
            res.status(200).json({
                code: 200,
                productos
            });
        })
});

/**
 * Obtiene producto por id
 * populate: usuario categoria
 * paginado
 */
app.get('/productos/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    message: err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    code: 400,
                    message: 'Producto no encontrado'
                });
            }
            res.status(200).json({
                code: 200,
                message: 'Producto encontrado',
                producto: productoDB
            });
        });
});

/**
 * Buscar producto por nombre
 */
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    code: false,
                    err
                });
            }
            res.status(200).json({
                code: true,
                productos
            });
        });
});

/**
 * Crear un nuevo producto
 * Guardar un nuevo producto
 */
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUnitario: body.precioUnitario,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    // guarda el producto
    producto.save((err, productoDB) => {
        // Si existe error
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            });
        }
        // guarda con exito el producto
        res.status(201).json({
            code: 201,
            message: 'Exito, producto guardado',
            producto: productoDB
        });

    });
});

/**
 * Actualizar producto
 */
app.put('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                code: 400,
                message: 'Error, producto no encontrado'
            });
        }
        // Crea instancia de producto
        productoDB.nombre = body.nombre;
        productoDB.precioUnitario = body.precioUnitario;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    message: err
                });
            }
            res.status(200).json({
                code: true,
                message: 'Exito, producto actualizado',
                producto: productoGuardado
            });
        });
    });
});

/**
 * Borrar producto
 */
app.delete('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                code: 400,
                err: 'Producto no encontrado'
            });
        }
        // Cambia estado de disponible nada mas
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    message: err
                });
            }
            res.status(200).json({
                code: 200,
                mensaje: 'Producto borrado',
                producto: productoBorrado
            });
        });
    });
});

module.exports = app;