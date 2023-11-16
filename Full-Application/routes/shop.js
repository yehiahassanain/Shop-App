const path = require('path');

const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');
router.get('/', shopController.getIndex);
router.get('/products', shopController.getproducts);
router.get('/products/:productId',shopController.getproduct);
router.get('/cart', shopController.getcart);
router.post('/cart', shopController.postcart);
router.post('/cart-delete-item',shopController.postCartDeleteProduct);
router.get('/orders', shopController.getOrder);
router.get('/checkout', shopController.getcheckout);
module.exports = router;