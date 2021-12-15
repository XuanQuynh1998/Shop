const Cart = require("../models/Cart");
const Product = require("../models/Product");

const { multipleMongooseToObject, mongooseToObject } = require("../utils/mongoose");

const checkQuantity = async (productId, quantity) => {
    const productRemain = await Product.findOne({ slug: productId }, { quantity: 1 });

    if (quantity > productRemain.quantity) {
        return { success: false, remain: productRemain.quantity };
    }
    return { success: true };
};

class CartController {
    async add(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const productId = req.body.productId;
                const quantity = +req.body.numberProduct;
                const checked = JSON.parse(req.body.buyNow);

                const productData = {
                    username: username,
                    productId: productId,
                    quantity: +quantity,
                    checked: checked,
                };

                if (checked) {
                    await Cart.updateMany({ username: username, checked: true }, { checked: false });
                }

                const findDuplicateProduct = await Cart.find({
                    username: username,
                    productId: productId,
                });

                let currentCartProductQuantity = 0;
                if (findDuplicateProduct.length) {
                    currentCartProductQuantity = findDuplicateProduct[0].quantity;
                }

                const currentQuantity = productData.quantity + Number(currentCartProductQuantity);

                const checkQuantityRemaining = await checkQuantity(productId, currentQuantity);
                if (!checkQuantityRemaining.success) {
                    return res.json(checkQuantityRemaining);
                }

                if (findDuplicateProduct.length) {
                    if (!isNaN(quantity)) {
                        await Cart.updateOne(
                            { username: username, productId: productId },
                            { quantity: currentQuantity, checked: checked }
                        );
                    }
                } else {
                    Cart.create(productData, (err) => {
                        if (err) {
                            return res.json({ success: false, message: err });
                        }
                    });
                }

                const currentProduct = await Product.findOne({
                    slug: productId,
                });
                const newQuantity = currentProduct.quantity - quantity;
                await Product.updateOne({ slug: productId }, { quantity: newQuantity });

                return res.json({
                    success: true,
                    message: "Lưu sản phẩm thành công",
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async update(req, res, next) {
        try {
            if (req.user) {
                const cartInfo = req.body.cartInfo;
                const action = req.body.action;
                const username = req.user.username;

                const adjustQuantity = async (productId, quantity) => {
                    const cartProduct = await Cart.find(
                        { username: username, productId: productId },
                        {
                            _id: 0,
                            quantity: 1,
                        }
                    );

                    if (cartProduct[0].quantity !== quantity) {
                        await Cart.findOneAndUpdate(
                            {
                                username: username,
                                productId: productId,
                            },
                            { quantity: quantity }
                        );
                    }
                };

                const selectToBuy = async (cartInfo) => {
                    let listProductId = [];
                    for (var i = 0; i < cartInfo.length; i++) {
                        let productId = cartInfo[i][0];

                        await Cart.updateOne({ username: username, productId: productId }, { checked: true });
                        listProductId.push(productId);
                    }
                    await Cart.updateMany(
                        {
                            username: username,
                            productId: { $nin: listProductId },
                        },
                        { checked: false }
                    );
                };

                const caculateCurrentProductPrice = async (productId, quantity) => {
                    const itemPrice = await Product.findOne({ slug: productId }, { price: 1, _id: 0 });

                    const totalPrice = itemPrice.price * quantity;

                    return totalPrice;
                };

                const calulateAllprice = async (cartInfo) => {
                    let totalPrice = 0;
                    const checkedProducts = await Cart.find({
                        username: username,
                        checked: true,
                    });
                    for (let i = 0; i < checkedProducts.length; i++) {
                        const productId = checkedProducts[i].productId;
                        const quantity = +checkedProducts[i].quantity;

                        const getPriceProduct = await Product.find({ slug: productId }, { _id: 0, price: 1 });

                        totalPrice += getPriceProduct[0].price * +quantity;
                    }

                    return totalPrice;
                };

                if (cartInfo) {
                    if (action === "select") {
                        await selectToBuy(cartInfo);
                    }
                    if (action === "adjust") {
                        let productId = cartInfo[0][0];
                        let quantity = +cartInfo[0][1];

                        const checkQuantityRemaining = await checkQuantity(productId, quantity);
                        if (!checkQuantityRemaining.success) {
                            return res.json(checkQuantityRemaining);
                        }

                        await adjustQuantity(productId, quantity);
                        const currentItemPrice = await caculateCurrentProductPrice(productId, quantity);
                        return res.json({ success: true, currentItemPrice: currentItemPrice });
                    }
                    const allPrice = await calulateAllprice(cartInfo);
                    return res.json({ success: true, allPrice: allPrice });
                } else {
                    await Cart.updateMany({ username: username }, { checked: false });
                    return res.json({ success: true, allPrice: 0 });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getCart(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;

                const getMatchProducts = async (addedProducts) => {
                    let listMatchProduct = [];

                    for (let i = 0; i < addedProducts.length; i++) {
                        const getMatchProduct = await Product.findOne(
                            { slug: addedProducts[i].productId },
                            {
                                name: 1,
                                price: 1,
                                salePrice: 1,
                                slug: 1,
                                images: { $slice: 1 },
                            }
                        );

                        listMatchProduct = listMatchProduct.concat(getMatchProduct);
                    }
                    return listMatchProduct;
                };

                const addedProducts = await Cart.find({ username: username });

                let listDataProduct = await getMatchProducts(addedProducts);
                listDataProduct = multipleMongooseToObject(listDataProduct);

                const listQuantity = addedProducts.map((product) => {
                    return product.quantity;
                });

                for (let i = 0; i < listQuantity.length; i++) {
                    listDataProduct[i]["quantity"] = listQuantity[i];
                    listDataProduct[i]["checked"] = addedProducts[i].checked;
                }

                res.json(listDataProduct);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async remove(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const productId = req.params.productId;
                const quantity = +req.params.quantity;

                const currentProduct = await Product.findOne({
                    slug: productId,
                });

                //Restore number product to store
                const newQuantity = currentProduct.quantity + quantity;
                await Product.updateOne({ slug: productId }, { quantity: newQuantity });

                //remove product from cart
                await Cart.deleteOne({ username: username, productId: productId }, (err, done) => {
                    if (err) {
                        return res.json({ success: false, message: err });
                    }
                    return res.json({
                        success: true,
                        message: "Xóa đơn hàng thành công",
                    });
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async removeAllCart(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                await Cart.deleteMany({ username: username, checked: true });
                return res.json({ success: true });
            }
        } catch (err) {
            console.log(err);
        }
    }

    viewCart(req, res, next) {
        console.log(req.params);
    }
}

module.exports = new CartController();
