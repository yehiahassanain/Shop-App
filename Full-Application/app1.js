const path = require('path');
const http = require('http');
const fs = require('fs');
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const adminrouter = require('./routes/admin');
const shoproutert = require('./routes/shop');
const geterror = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.set('view engine','ejs');
app.set('views','views');


app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById('6571c3817268ccc78e93422f')
    .then(user=>{
        req.user = new User(user.name,user.email,user.cart,user._id);
        next();
    })
    .catch(err=>{
        console.log(err);
    })
});

app.use('/admin',adminrouter);
app.use(shoproutert);
app.use(geterror.get404);

mongoConnect(()=>{
    app.listen(3000);
})