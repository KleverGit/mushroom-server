require('../config/config');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
app.use(require('../src/routes/index'));
// mongoose conexion
mongoose.connect(process.env.URLBDD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log(`BDD online ${process.env.NODE_ENV}`);
}).catch(err => {
    throw new Error(`Error! BDD cant connect to: ${process.env.URLBDD}`);
});
// listen pn port
app.listen(process.env.PORT, () => {
    console.log(`Listen on port ${process.env.PORT}`);
});

// https://gorest.co.in/public-api/users