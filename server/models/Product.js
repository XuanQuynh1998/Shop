const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name: { type: String, default: "" },
        description: { type: String },
        price: { type: Number },
        salePrice: { type: Number, default: 0 },
        images: [],
        brand: { type: String },
        country: { type: String },
        quantity: { type: Number },
        slug: { type: String, slug: "name", unique: true },
        sold: { type: Number, default: 0 },
        sale: { type: Boolean },
    },
    {
        timestamps: true,
    }
);

ProductSchema.index({ name: "text", country: "text", brand: "text" });

// Add plugin
mongoose.plugin(slug);

module.exports = mongoose.model("Product", ProductSchema);
