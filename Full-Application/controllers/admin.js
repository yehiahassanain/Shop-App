const Product = require("../models/product");

exports.getAddproduct = (req,res,next)=>{
    res.render('admin/edit-product',
    {pageTitle: "Add product",
    path: '/admin/add-product',
    activeproduct:true,
    formsCSS: true, 
    productCSS: true,
    editing: false
    });
};
exports.postAddproduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null,title,imageUrl,price,description);
    product.save();
    res.redirect('/');
};

exports.geteditproduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};
exports.posteditproduct = (req,res,next)=>{
    const prodId = req.body. productId;
    const updatetitle = req.body.title;
    const updateimageUrl = req.body.imageUrl;
    const updateprice = req.body.price;
    const updatedescription = req.body.description;
    const product = new Product(prodId,updatetitle,updateimageUrl,updateprice,updatedescription);
    product.save();
    res.redirect('/admin/products');
};
exports.postDeletProduct = (req,res,next)=>{
  const productId = req.body.productId;
  Product.delete(productId);
  res.redirect('/admin/products');
}
// .\//////////////////
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