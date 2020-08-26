const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} not valid'
};

/**
 * Product model maped to Monggose Schema
 */
let Schema = mongoose.Schema;
let userSchema = new Schema({
    id_user: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: [true, 'name required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email required']
    },
    password: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        required: false
    }
});

// only for select
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
// plugin validator
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });
module.exports = mongoose.model('User', userSchema);