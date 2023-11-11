const express = require('express');
const router = express.Router();
const path = require('path')
const rootdir = require('../util/path');
const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddproduct);
router.get('/products', adminController.getProduct);
router.post('/add-product', adminController.postAddproduct);

module.exports = router;