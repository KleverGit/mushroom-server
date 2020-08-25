const express = require('express');
let { verificarToken, verificarAdminRole } = require('../middlewares/authentication');
let app = express();
let Categoria = require('../models/Categoria');

/**
 * Obtiene todas las categorias
 */
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    message: err
                });
            }
            res.status(200).json({
                code: 200,
                categorias
            });

        })
});

/**
 * Obtiene catogoria por id
 */
app.get('/categoria/:id', verificarToken, (req, res) => {
    // Categoria.findById(....);
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                code: 500,
                message: 'No se encontro categoria con id dado'
            });
        }
        res.status(200).json({
            code: true,
            categoria: categoriaDB
        });
    });
});

/**
 * Guardar nueva categoria
 */
app.post('/categoria', verificarToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;
    // Cuando se hace el request en el verifica token ahi viene el id del usuario
    // Viene en verificaToken
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    // guarda categoria
    categoria.save((err, categoriaDB) => {
        // si hay error al guardar
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            });
        }
        // Si no se puede guardar retorna error
        if (!categoriaDB) {
            return res.status(400).json({
                code: 400,
                message: err
            });
        }
        // si todo da bien retorna una nueva categoria
        res.status(200).json({
            code: 200,
            message: `Exito, Categoria ${categoriaDB.descripcion} creada`,
            categoria: categoriaDB
        });
    });
});

/**
 * Editar categoria por id
 * Como la descripcion es unca solo se puede editar el usuario que la creo
 */
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    /*let descCategoria = {
        descripcion: body.descripcion
    };*/
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                code: 400,
                message: err
            });
        }
        res.status(200).json({
            code: 200,
            message: `Exito, Categoria editdad ${categoriaDB.descripcion}`,
            categoria: categoriaDB
        });
    });
});

/**
 * Borra la categoria unicamente validado por role admin
 */
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    // solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                code: 400,
                message: 'Error al eliminar categoria'

            });
        }
        res.status(200).json({
            code: 200,
            message: 'Categoria borrada con exito',
            categoria: categoriaDB
        });
    });
});


module.exports = app;