const fs = require('fs');
const { get } = require('http');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id,title,ImageUrl,price,description) {
    this.id = id;
    this.title = title;
    this.ImageUrl = ImageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id){
        const existingproductindex = products.findIndex(prod => prod.id === this.id);
        const updateproduct = [...products];
        updateproduct[existingproductindex] = this;
        fs.writeFile(p, JSON.stringify(updateproduct), err => {
          console.log(err);
        });
      }else{
      this.id = Math.random().toString();
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id,cb){
    getProductsFromFile(products=>{
      const product = products.find(p => id===p.id);
      cb(product);
    });
  }
  static delete(id){
    getProductsFromFile(products=>{
      const product = products.find(p=>p.id===id);
      const updateProduct = products.filter(p=>p.id !== id);
      // console.log(updateProduct);
      fs.writeFile(p, JSON.stringify(updateProduct), err=>{
        if (!err){
          Cart.deleteproduct(id,product.price);        
        }
      });
    });
  }
};