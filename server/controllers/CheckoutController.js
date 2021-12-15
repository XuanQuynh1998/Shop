const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Checkout = require("../models/Checkout");
const User = require("../models/User");

class CheckoutController {
    async checkoutProduct(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                let allPrice = 0;
                let listProductSlug = [];

                const checkedProducts = await Cart.find({ username: username, checked: true });
                for (let i = 0; i < checkedProducts.length; i++) {
                    listProductSlug.push(checkedProducts[i].productId);
                }

                let productInfo = await Product.find(
                    { slug: { $in: listProductSlug } },
                    {
                        name: 1,
                        price: 1,
                        images: { $slice: 1 },
                        slug: 1,
                    }
                );

                for (let i = 0; i < productInfo.length; i++) {
                    checkedProducts.some((product) => {
                        if (product.productId === productInfo[i].slug) {
                            productInfo[i]["quantity"] = product.quantity;
                            allPrice += productInfo[i].price * +productInfo[i].quantity;
                            return true;
                        }
                    });
                }

                return res.json([productInfo, allPrice]);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async orderProduct(req, res, next) {
        try {
            if (req.user) {
                const changeSoldItem = async (listProducts) => {
                    for (let i = 0; i < listProducts.length; i++) {
                        const currentSoldProduct = await Product.findOne(
                            { slug: listProducts[i].productId },
                            { sold: 1, _id: 0 }
                        );

                        await Product.updateOne(
                            { slug: listProducts[i].productId },
                            { sold: currentSoldProduct.sold + +listProducts[i].quantity }
                        );
                    }
                };

                const username = req.user.username;
                const checkoutProductData = req.body.checkoutData;
                const checkout = checkoutProductData.checkoutProduct;
                const message = checkoutProductData.message;
                const addressInfo = checkoutProductData.addressInfo;

                const findCheckoutDuplicate = await Checkout.findOne({ username: username });

                if (findCheckoutDuplicate) {
                    await Checkout.updateOne({
                        username: username,
                        $push: {
                            checkoutProduct: {
                                message: message,
                                order: checkout,
                                addressInfo: addressInfo,
                            },
                        },
                    });

                    await changeSoldItem(checkout);
                    return res.json({ success: true });
                }

                await Checkout.create({
                    username: username,
                    checkoutProduct: {
                        message: message,
                        order: checkout,
                        addressInfo: addressInfo,
                    },
                });

                await changeSoldItem(checkout);
                return res.json({ success: true });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getOrderProduct(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const orderData = await Checkout.findOne(
                    { username: username },
                    { checkoutProduct: 1, shippingFee: 1, orderDate: 1, _id: 0 }
                );

                const getListOrderProducts = async (slugAndQuantity) => {
                    const listProduct = [];
                    for (let i = 0; i < slugAndQuantity.length; i++) {
                        const data = await Product.findOne(
                            { slug: slugAndQuantity[i].productId },
                            { name: 1, price: 1, salePrice: 1, images: { $slice: 1 }, slug: 1, sale: 1 }
                        );

                        data["quantity"] = slugAndQuantity[i].quantity;
                        listProduct.push(data);
                    }

                    return listProduct;
                };

                const getOrderProductDetails = async (allSlugAndQuantity) => {
                    const data = [];

                    for (let i = 0; i < allSlugAndQuantity.length; i++) {
                        const getOrderProductDetails = await getListOrderProducts(allSlugAndQuantity[i]);
                        const shippingFee = checkoutProducts[i].shippingFee;
                        const orderDate = checkoutProducts[i].orderDate;
                        data.push({ orderDetail: getOrderProductDetails, shippingFee, orderDate });
                    }

                    return data;
                };

                const checkoutProducts = orderData.checkoutProduct;
                const allSlugAndQuantity = checkoutProducts.map((checkoutProduct) => {
                    return checkoutProduct.order.map((order) => {
                        return order;
                    });
                });

                const allPurchaseProduct = await getOrderProductDetails(allSlugAndQuantity);

                return res.json(allPurchaseProduct);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async setAddress(req, res, next) {
        try {
            if (req.user) {
                const username = req.user.username;
                const addressId = req.body.addressId;

                const addressInfo = await User.findOne(
                    {
                        username: username,
                    },
                    { addresses: { $elemMatch: { _id: addressId } } }
                );

                return res.json({ success: true, addressInfo: addressInfo.addresses });
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new CheckoutController();
