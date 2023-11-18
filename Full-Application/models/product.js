const fs = require('fs');
const { get } = require('http');
const path = require('path');
const Cart = require('./cart');
const db = require('../util/database');

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
    return db.execute('INSERT INTO products (titlel,price,imageUrl,description) VALUES(?,?,?,?)',
    [this.title,this.price,this.ImageUrl,this.description]
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id){
   return db.execute('SELECT * FROM products WHERE products.id = ?',[id]);
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