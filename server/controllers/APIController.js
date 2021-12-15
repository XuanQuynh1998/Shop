const Product = require("../models/Product");
const { multipleMongooseToObject, mongooseToObject } = require("../utils/mongoose");
const { sortHandle } = require("../utils/sort_search");

class APIController {
    getUsername(req, res, next) {
        if (req.user) {
            return res.json({ user: req.user });
        }
        return res.json({});
    }

    async getProducts(req, res, next) {
        let numberPage = parseInt(req.params.page);
        let options = {
            limit: 10,
            skip: 10 * numberPage - 10,
        };
        const products = await Product.find(
            {},
            {
                description: 0,
                image: { $slice: 1 },
            },
            options
        )
            .sort({ createdAt: "desc" })
            .exec();
        try {
            return res.json(multipleMongooseToObject(products));
        } catch {}
    }

    async getProductBySlug(req, res, next) {
        const product = await Product.findOne({ slug: req.params.slug });
        try {
            return res.json(mongooseToObject(product));
        } catch {}
    }

    async getNumberProducts(req, res, next) {
        const count = await Product.countDocuments({});
        try {
            return res.json(count);
        } catch {}
    }

    async getProductByPage(req, res, next) {
        const sort_search = sortHandle(req);
        const numberProducts = Product.countDocuments({});
        const products = Product.find({}, { description: 0, images: { $slice: 1 } }, sort_search[0])
            .sort(sort_search[1])
            .exec();
        await Promise.all([numberProducts, products]).then((data) => {
            return res.json(Array.from([data[0], multipleMongooseToObject(data[1])]));
        });
    }

    async searchProduct(req, res, next) {
        const sort_search = sortHandle(req);
        const { name } = req.params;
        if ({ name }) {
            const numberProducts = Product.countDocuments({
                $text: { $search: `${name}` },
            });

            const products = Product.find(
                { $text: { $search: `${name}` } },
                { description: 0, image: { $slice: 1 } },
                sort_search[0]
            )
                .sort(sort_search[1])
                .exec();
            await Promise.all([numberProducts, products]).then((data) => {
                return res.json(Array.from([data[0], multipleMongooseToObject(data[1])]));
            });
        }
    }
}

module.exports = new APIController();
