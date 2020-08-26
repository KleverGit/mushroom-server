const express = require('express');
const { verifyToken } = require('../middlewares/autenticacion');

let app = express();
let Product = require('../models/product.model');


/**
 * GET al products
 */
app.get('/productos', verifyToken, (req, res) => {
    let start = req.query.start || 0;
    start = Number(start);

    Product.find({ enable: true })
        .skip(start)
        .limit(5)
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    err
                });
            }
            res.json({
                code: 500,
                products
            });


        })

});

/**
 * GET product by id
 */
app.get('/productos/:id', (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    code: 500,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    code: 400,
                    err: {
                        message: 'product not found'
                    }
                });
            }

            res.json({
                code: 200,
                producto: productDB
            });

        });

});

/**
 * GET products by filter
 */
app.get('/product/find/:searchText', verifyToken, (req, res) => {

    let searchText = req.params.searchText;
    let regex = new RegExp(searchText, 'i');

    Product.find({ nombre: regex })
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    err
                });
            }

            res.json({
                code: 200,
                product
            })

        })


});



/**
 * POST save new Product
 */
app.post('/products', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        user: req.user._id,
        name: body.name,
        price: body.price,
        description: body.description,
        enable: body.enable
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                err
            });
        }

        res.status(201).json({
            code: 201,
            product: productDB
        });

    });

});

/**
 * UPDATE product
 */
app.put('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                code: 500,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                code: 400,
                err: {
                    message: 'product not found'
                }
            });
        }

        productDB.name = body.name;
        productDB.price = body.price;
        productDB.enable = body.enable;
        productDB.description = body.description;

        productDB.save((err, productSave) => {

            if (err) {
                return res.status(500).json({
                    code: 500,
                    err
                });
            }

            res.json({
                code: 201,
                producto: productSave
            });

        });
    });
});

/**
 * DELETE products
 */
app.delete('/products/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                code: 500,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                code: 400,
                err: {
                    message: 'product not found'
                }
            });
        }

        productDB.enable = false;

        productDB.save((err, productDelete) => {

            if (err) {
                return res.status(500).json({
                    code: 500,
                    err
                });
            }

            res.json({
                code: 200,
                producto: productDelete,
                mensaje: 'delete product'
            });

        })
    })


});






module.exports = app;