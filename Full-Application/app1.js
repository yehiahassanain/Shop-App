const path = require('path');
const http = require('http');
const fs = require('fs');
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const adminrouter = require('./routes/admin');
const shoproutert = require('./routes/shop');
const authroutert = require('./routes/auth');
const geterror = require('./controllers/errors');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongoose = require('mongoose');
const user = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
app.set('view engine','ejs');
app.set('views','views');

const MONGO_urI = 'mongodb+srv://yehiahassanain:efoszQPFvYVZGA8o@cluster0.j3razmw.mongodb.net/shop';
const store = new MongoDBStore({
    uri: MONGO_urI,
    collection: 'sessions'
});

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
    secret: 'my secret',
     resave: false,
     saveUninitialized: false,
     store: store
     })
);

app.use((req,res,next)=>{
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
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
app.use(authroutert);
app.use(geterror.get404);

mongoose
    .connect(
        MONGO_urI
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