var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Product model maped to Monggose Schema
 */
var productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'product name required']
    },
    price: {
        type: Number,
        required: [true, 'product price required']
    },
    description: {
        type: String,
        required: false
    },
    enable: {
        type: Boolean,
        required: true,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Product', productSchema);