const express = require('express');
const router = express.Router();
const path = require('path');

const HomeController = require('../controllers/HomeController');

router.get('/*', checkAuthentication, HomeController.index);

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendFile(path.join(__dirname, '../../', 'client', 'index.html'))
    }
}

module.exports = router;