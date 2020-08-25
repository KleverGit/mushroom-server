const express = require('express');
const app = express();

app.use(require('./user-routes'));
app.use(require('./login-routes'));
app.use(require('./categoria-routes'));
app.use(require('./producto-routes'));
app.use(require('../../uploads/upload-routes'));

module.exports = app;