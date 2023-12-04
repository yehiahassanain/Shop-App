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
    req.user.createProduct({
      title: title,
      price:price,
      imageUrl:imageUrl,
      description: description
    })
    .then(result=>{
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err=>{
      console.log(err);
    })
};

exports.geteditproduct = (req,res,next)=>{
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // Product.findByPk(prodId)
    req.user
      .getProducts({where: {id: prodId}})
      .then(products => {
        const product = products[0];
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
      })
      .catch(err=>{
          console.log(err);
        });
};
exports.posteditproduct = (req,res,next)=>{
    const prodId = req.body. productId;
    const updatetitle = req.body.title;
    const updateimageUrl = req.body.imageUrl;
    const updateprice = req.body.price;
    const updatedescription = req.body.description;
    Product.findByPk(prodId)
          .then(product=>{
            product.title = updatetitle;
            product.imageUrl = updateimageUrl;
            product.price = updateprice;
            product.description = updatedescription;
            return product.save();
          })
          .then(result=>{
            console.log('Upsate succesful');
            res.redirect('/admin/products');
          })
          .catch(err=>{
            console.log(err);
          });
};
exports.postDeletProduct = (req,res,next)=>{
  const productId = req.body.productId;
  Product.findByPk(productId)
      .then(product=>{
        return product.destroy();
      })
      .then(result=>{
        console.log('Destroued product');
        res.redirect('/admin/products');
      })
      .catch(err=>console.log(err));
}
// .\//////////////////
exports.getProduct = (req,res,next)=>{
  // Product.findAll()
  req.user.getProducts()
    .then(products=>{
      res.render('admin/products',
          {
            prods: products,
            pageTitle:'products',
            path: '/admin/products',
            hasproduct: products.length>0,
            activeshop:true,
            formsCSS:true
          });
    })
    .catch(err=>{
      console.log(err);
    });
};