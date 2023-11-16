const express = require('express');
const router = express.Router();
const path = require('path')
const rootdir = require('../util/path');
const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddproduct);
router.get('/products', adminController.getProduct);
router.post('/add-product', adminController.postAddproduct);
router.get('/edit-product/:productId', adminController.geteditproduct);
router.post('/edit-product',adminController.posteditproduct);
router.post('/delete-product',adminController.postDeletProduct);
module.exports = router;