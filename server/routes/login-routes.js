const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../models/Usuario');


app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioFind) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                message: err
            })
        }
        if (!usuarioFind) {
            return res.status(500).json({
                code: 500,
                message: `Usuario o pass incorrecto`
            });
        }
        // Compara con el bcrypt si el password ingresado es igual al de la BDD
        if (!bcrypt.compareSync(body.password, usuarioFind.password)) {
            return res.status(500).json({
                code: 500,
                message: `Usuario o pass incorrecto`
            });
        }

        let token = jwt.sign({
            usuario: usuarioFind
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        return res.status(200).json({
            code: 200,
            message: `Usuario ${body.email} logeado con exito`,
            token: token
        });
    });

});


module.exports = app;