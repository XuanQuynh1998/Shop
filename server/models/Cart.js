const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CartSchema = new Schema({
    username: String,
    productId: String,
    quantity: Number,
    checked: Boolean,
});

module.exports = mongoose.model('Cart', CartSchema);