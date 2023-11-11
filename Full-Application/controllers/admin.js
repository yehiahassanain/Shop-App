const Product = require("../models/product");

exports.getAddproduct = (req,res,next)=>{
    res.render('admin/add-product',
    {pageTitle: "Add product",
    path: '/admin/add-product',
    activeproduct:true,
    formsCSS: true, 
    productCSS: true
    });
};
exports.postAddproduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title,imageUrl,price,description);
    product.save();
    res.redirect('/');
};
exports.getProduct = (req,res,next)=>{
    Product.fetchAll(products=>{
        res.render('admin/products',
          {
            prods: products,
            pageTitle:'products',
            path: '/admin/products',
            hasproduct: products.length>0,
            activeshop:true,
            formsCSS:true
          });
      });
};