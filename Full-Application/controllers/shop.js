const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');
const ITEM_PER_PAGE = 1;


exports.getProducts = (req, res, next) => {
  // there is add the pagination of page product
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE)
      });
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  // there is add the pagination of the page (shop)
  const page = +req.query.page ||1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then(numProducts=>{
      totalItems = numProducts;
      return Product.find()
      .skip((page-1)*ITEM_PER_PAGE)
      .limit(ITEM_PER_PAGE)
    }).then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        totaProduct: totalItems,
        currentPage: page,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE) 
      });
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req,res,next) =>{
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      let total = 0;
      products.forEach(p=>{
        total+=p.quantity*p.productId.price;
      })
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'checkout',
        products: products,
        totalSum: total
      });
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// here we write code to downloaded file
exports.getInvoice = (req,res,next)=>{
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then(order=>{
    if (!order){
      return next(new Error('No order found.'));
    }
    if (order.user.userId.toString()!==req.user._id.toString()){
      return next(new Error('Unauthorized'));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data','invoices',invoiceName);

    // create a new file pdf
    const pdfDoc = new pdfDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(24).text('invoice',{
      underline: true
    });
    pdfDoc.text('-----------------------');
    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
      .fontSize(14)
      .text(
        prod.product.title +
          ' - ' +
          prod.quantity +
          ' x ' +
          '$' +
          prod.product.price
      );
    });
    pdfDoc.text('---');
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
    pdfDoc.end();
    // fs.readFile(invoicePath, (err,data)=>{
    //   if (err){
    //     return next(err);
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    //   res.send(data);
    // });
    // const file = fs.createReadStream(invoicePath);
    
    // file.pipe(res);
  })
  .catch(err=> next(err))
}