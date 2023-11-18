const Product = require("../models/product");
const cart = require("../models/cart");
exports.getproducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows,fieldData])=>{
      res.render('shop/product-list',
      {
        prods: rows,
        pageTitle:'All product',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getproduct = (req,res,next)=>{
  const productId = req.params.productId;
  Product.findById(productId)
  .then(([product])=>{
    console.log(product);
    res.render('shop/product-detail',{
      prods: product[0],
        pageTitle: product[0].title,
        path: '/products',
    });
  })
  .catch(err=>console.log(err));
  // res.redirect('/');
};

exports.getIndex = (req,res,next)=>{
  Product.fetchAll()
    .then(([rows,fieldData])=>{
      res.render('shop/index',
      {
        prods: rows,
        pageTitle:'shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
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