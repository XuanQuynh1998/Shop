const express = require('express');
const router = express.Router();

const  APIController = require('../controllers/APIController');

router.get('/user', APIController.getUsername);
router.get('/products', APIController.getProducts);
router.get('/products/:slug', APIController.getProductBySlug);
router.get('/products/page/number', APIController.getNumberProducts);
router.get('/products/page/:page/:sort/:type', APIController.getProductByPage);
router.get('/products/search/:page/:sort/:type/:name', APIController.searchProduct);

module.exports = router;