const fs = require("fs");
const path = require("path");
const googleDrive = require("../config/googleDrive/googleDrive.config");
const multer = require("multer");

async function uploadImage(folderId) {
    const imagePath = path.join("./", "uploads");
    const imageName = fs.readdirSync(imagePath)[0];

    const imageId = await googleDrive.uploadFile(imagePath, imageName, folderId);
    await googleDrive.generatePublicUrl(imageId);
    return `https://lh3.googleusercontent.com/d/${imageId}`;
}

async function removePreAvatar(avatarId) {
    await googleDrive.deleteFile(avatarId);
}

module.exports = { uploadImage, removePreAvatar };
