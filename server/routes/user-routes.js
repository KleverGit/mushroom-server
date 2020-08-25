const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const Usuario = require('../models/Usuario');
const { verificarToken } = require('../middlewares/authentication');

app.get('/', (req, res) => {
    res.json({ message: 'Mensaje enviado' });
});

/**
 * Busca usuarios
 * verificar token es el middleware de validacion del token
 */
app.get('/usuario', verificarToken, (req, res) => {

    let totalItems = req.query.totalItems || 0;
    let pagina = req.query.pagina || 0;


    // si en find({}) va vacio obtiene todos
    Usuario.find({ estado: true }, 'nombre email estado')
        .skip(Number(pagina))
        .limit(Number(totalItems)).exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    code: 400,
                    message: err
                })
            }
            Usuario.count({ estado: true }, (err, total) => {
                res.status(200).json({
                    code: 200,
                    message: `Listado de usuarios`,
                    total: total,
                    usuarios
                });
            });
        });
});

/**
 * Guarda un nuevo usuaario 
 * valida que el mail sea unico
 */
app.post('/usuario', (req, res) => {
    let body = req.body;
    // encripta el password
    body.password = bcrypt.hashSync(body.password, 10);
    let usuario = new Usuario(body);
    usuario.save((err, usuarioResp) => {
        if (err) {
            return res.status(400).json({
                code: 400,
                message: err
            })
        }

        if (!usuarioResp) {
            return res.status(400).json({
                code: 400,
                message: 'Error crear usuario'
            });
        }

        res.status(201).json({
            code: 201,
            message: `Usuario ${body.nombre} guardado con exito`,
            usuario: usuarioResp
        });
    });
});

/**
 * Actualiza un usuario 
 */
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    console.log('id del usuario ---> ', id);
    console.log('body ---> ', JSON.stringify(body));
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userUpdate) => {
        if (err) {
            return res.status(400).json({
                code: 400,
                message: err
            })
        }
        if (!userUpdate) {
            return res.status(400).json({
                code: 400,
                message: 'Error al actualizar usuario'
            });
        }
        res.status(200).json({
            code: 200,
            message: `Usuario actualizado con exito`,
            usuario: userUpdate
        });
    });

});

/**
 * Borrado logico cambia estado a false
 */
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, userUpdate) => {
        if (err) {
            return res.status(400).json({
                code: 400,
                message: err
            })
        }
        res.status(200).json({
            code: 200,
            message: `Usuario eliminado con exito`,
            usuario: userUpdate
        });
    });

});

// Solo cuando se quiere borrar fisicamente y no recuperar mas
/* app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, userDelete) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            });
        }
        if (!userDelete) {
            return res.status(500).json({
                code: 500,
                message: 'Usuario no encontrado'
            });
        }
        res.status(200).json({
            code: 200,
            message: `Usuario eliminado con exito`,
            data: userDelete
        });
    });
}); */

module.exports = app;