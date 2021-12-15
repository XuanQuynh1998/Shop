const express = require("express");
const router = express.Router();

const CartController = require("../controllers/CartController");

router.post("/add", CartController.add);
router.post("/update", CartController.update);
router.get("/get_cart", CartController.getCart);
router.get("/remove/:productId/:quantity", CartController.remove);
router.get("/remove_all", CartController.removeAllCart);
router.get("/view_cart", CartController.viewCart);

module.exports = router;
