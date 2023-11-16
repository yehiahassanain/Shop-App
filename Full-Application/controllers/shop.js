const Product = require("../models/product");
const cart = require("../models/cart");
exports.getproducts = (req, res, next) => {
  Product.fetchAll(products=>{
    res.render('shop/product-list',
      {
        prods: products,
        pageTitle:'All product',
        path: '/products',
        hasproduct: products.length>0,
        activeshop:true,
        formsCSS:true
      });
  });
};

exports.getproduct = (req,res,next)=>{
  const productId = req.params.productId;
  Product.findById(productId,product=>{
    res.render('shop/product-detail',{
      prods: product,
        pageTitle: product.title,
        path: '/products',
    });
    console.log(product);
  });
  // res.redirect('/');
};

exports.getIndex = (req,res,next)=>{
  Product.fetchAll(products=>{
    res.render('shop/index',
      {
        prods: products,
        pageTitle:'shop',
        path: '/',
        hasproduct: products.length>0,
        activeshop:true,
        formsCSS:true
      });
  });
};


exports.getcart = (req,res,next)=>{
  cart.getProductCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (pr of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === pr.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: pr, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};
exports.postcart = (req,res,next)=>{
  const prodId = req.body.productId;
  Product.findById(prodId,product=>{
    cart.addProduct(prodId,product.price);
  });
  res.redirect('/cart')
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    cart.deleteproduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrder = (req,res,next)=>{
  res.render('shop/orders',
  {
    pageTitle:'Your orders',
    path: '/orders' 
  })
};

exports.getcheckout = (req,res,next)=>{
  res.render('shop/checkout',
  {
    pageTitle:'checkout',
    path: '/checkout' 
  })
};