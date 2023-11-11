const path = require('path');

const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');
router.get('/', shopController.getIndex);
router.get('/products', shopController.getproducts);
router.get('/cart', shopController.getcart);
router.get('/orders', shopController.getOrder);
router.get('/checkout', shopController.getcheckout);
module.exports = router;