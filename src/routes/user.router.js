const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user.model');

const { verifyToken, verifyRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/users', verifyToken, (req, res) => {

    let start = req.query.start || 0;
    start = Number(start);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, '')
        .skip(start)
        .limit(limit)
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    code: 400,
                    err
                });
            }

            User.count({ status: true }, (err, count) => {

                res.json({
                    code: 200,
                    users,
                    total: count
                });

            });


        });


});

/**
 * POST Method to save a new user
 */
app.post('/user', function (req, res) {

    let body = req.body;

    let user = new User({
        id_user: body.id_user,
        name: body.name,
        email: body.email,
        gender: body.gender,
        status: body.status,
        created_at: body.created_at,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                code: 400,
                err
            });
        }

        res.json({
            code: 201,
            user: userDB
        });
    });


});

/**
 * PUT Method to update user
 */
app.put('/user/:id', verifyToken, function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                code: 400,
                err
            });
        }

        res.json({
            code: 200,
            usuario: userDB
        });

    })

});

/**
 * DELETE Method to delete user
 */
app.delete('/user/:id', verifyToken, function (req, res) {
    let id = req.params.id;
    let userStatus = {
        estado: false
    };

    User.findByIdAndUpdate(id, userStatus, { new: true }, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                code: 400,
                err
            });
        };

        if (!userDelete) {
            return res.status(400).json({
                code: 400,
                err: {
                    message: 'User no encontrado'
                }
            });
        }

        res.json({
            code: 200,
            user: userDelete
        });
    });
});



module.exports = app;