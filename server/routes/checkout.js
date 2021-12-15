const express = require("express");
const router = express.Router();

const CheckoutController = require("../controllers/CheckoutController");

router.get("/checkout_product", CheckoutController.checkoutProduct);
router.post("/order", CheckoutController.orderProduct);
router.get("/get_order", CheckoutController.getOrderProduct);
router.post("/set_address", CheckoutController.setAddress);

module.exports = router;
