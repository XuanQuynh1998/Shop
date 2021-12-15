const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");

function authGoogle() {
    const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN, expiry_date: true });
    return google.drive({
        version: "v3",
        auth: oauth2Client,
    });
}

async function deleteUploadedFiles(fileName) {
    fs.unlink("./uploads/" + fileName, (err) => {
        if (err) throw err;
    });
}

async function uploadFile(imagesPath, imageName, folderId) {
    try {
        const drive = authGoogle();
        const response = await drive.files.create({
            requestBody: {
                name: imageName,
                mimeType: "image/jpg",
                parents: [folderId],
            },
            media: {
                mimeType: "image/jpg",
                body: fs.createReadStream(imagesPath + "/" + imageName),
            },
        });
        if (response.data) {
            console.log(response.data);
            await deleteUploadedFiles(imageName);
        }
        return response.data.id;
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteFile(imageId) {
    try {
        const drive = authGoogle();
        const response = await drive.files.delete({
            fileId: imageId,
        });
    } catch (error) {
        console.log(error.message);
    }
}

async function generatePublicUrl(imageId) {
    try {
        const drive = authGoogle();
        const fileId = imageId;
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const result = await drive.files.get({
            fileId: fileId,
            fields: "webViewLink, webContentLink",
        });
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { uploadFile, generatePublicUrl, deleteFile };
