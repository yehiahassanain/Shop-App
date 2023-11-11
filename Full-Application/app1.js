const path = require('path');
const http = require('http');
const fs = require('fs');
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const adminrouter = require('./routes/admin');
const shoproutert = require('./routes/shop');
const geterror = require('./controllers/errors');
// const expressHbs = require('express-handlebars');
// app.engine(
//     'hbs',
//     expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname:'hbs'}));
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin',adminrouter);
app.use(shoproutert);
app.use(geterror.get404);

app.listen(3000);
