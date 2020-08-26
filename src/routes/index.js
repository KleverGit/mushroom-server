const express = require('express');
const app = express();
app.use(require('./login.router'));
app.use(require('./user.router'));
app.use(require('./product.router'));
module.exports = app;