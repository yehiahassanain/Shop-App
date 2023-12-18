const path = require('path');
const http = require('http');
const fs = require('fs');
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const adminrouter = require('./routes/admin');
const shoproutert = require('./routes/shop');
const geterror = require('./controllers/errors');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongoose = require('mongoose');
const user = require('./models/user');

app.set('view engine','ejs');
app.set('views','views');


app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findById('657e1e44f15620c72f05718e')
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>{
        console.log(err);
    })
});

app.use('/admin',adminrouter);
app.use(shoproutert);
app.use(geterror.get404);

mongoose
    .connect(
        'mongodb+srv://yehiahassanain:efoszQPFvYVZGA8o@cluster0.j3razmw.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(result=>{
        User.findOne().then(user=>{
            if (!user){
                const user = new User({
                    name: 'Max',
                    email: 'Max@gemail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    });