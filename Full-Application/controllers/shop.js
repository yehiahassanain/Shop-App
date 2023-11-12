const Product = require("../models/product");
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
    console.log(product);
  });
  res.redirect('/');
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
  res.render('shop/cart',
  {
    pageTitle:'Your cart',
    path: '/cart' 
  })
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