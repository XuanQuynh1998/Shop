const Product = require("../models/Product");
const googleDrive = require("../config/googleDrive/googleDrive.config");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "./uploads/", limit: { fileSize: 50 } }).array("images", 10);

class ProductController {
    add(req, res, next) {
        upload(req, res, async function (err) {
            if (!req.files) {
                res.json({ error: "No Image" });
            }

            const checkValidData = (formData) => {
                const isSale = JSON.parse(formData.sale);
                formData.sale = isSale;
                if (isSale) {
                    return formData;
                }
                formData.salePrice = 0;
                return formData;
            };

            const uploadData = req.body;
            let product = checkValidData(uploadData);

            const googleDriveFolderId = "1pCRqmaeP-_FtwcSMlZiAiSgtSSWTU5s4";
            const imagePaths = path.join("./", "uploads");
            const listImageNames = fs.readdirSync(imagePaths);
            let id = [];

            for (const imageName of listImageNames) {
                let imageId = await googleDrive.uploadFile(imagePaths, imageName, googleDriveFolderId);
                await googleDrive.generatePublicUrl(imageId);
                id.push(`https://lh3.googleusercontent.com/d/${imageId}`);
            }

            product["images"] = id;
            await Product.create(product);
            return res.json({ success: true });
        });
    }
}

module.exports = new ProductController();
