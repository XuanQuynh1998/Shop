const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const CheckoutSchema = new Schema({
    username: String,
    checkoutProduct: [
        {
            message: { type: String, default: "" },
            order: [{ productId: String, quantity: Number }],
            shippingFee: { type: Number, default: 59000 },
            orderDate: { type: Date, default: Date.now() },
            addressInfo: { type: String, default: "" },
        },
    ],
});

CheckoutSchema.index({ "$**": "text" });

module.exports = mongoose.model("Checkout", CheckoutSchema);
