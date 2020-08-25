const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const app = express();

/**
 * login user
 */
app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                code: 500,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                code: 400,
                err: {
                    message: 'user or password are incorrect'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                code: 400,
                err: {
                    message: 'user or password are incorrect'
                }
            });
        }
        // sign token
        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        res.json({
            ok: true,
            usuario: userDB,
            token
        });
    });

});

module.exports = app;