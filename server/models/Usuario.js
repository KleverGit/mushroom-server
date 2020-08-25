const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'Rol no valido'
}

let Schema = mongoose.Schema;

let UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre usuario requerido']
    },
    email: {
        type: String,
        required: [true, 'Email de usaurio requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password de usuario requerido']
    },
    img: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    estado: {
        type: Boolean,
        required: false,
        default: true
    },
    isLogedGoogle: {
        type: Boolean,
        required: false,
        default: false
    }
});

mongoose.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', UsuarioSchema);