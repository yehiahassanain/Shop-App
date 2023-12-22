const User = require('../models/user');

exports.getLogin = (req,res,next)=>{
    // const isLoggeedIn = req.get('cookie').split('=')[1];
    console.log(req.session.isLoggedIn);
    res.render('auth/login',{
    path: '/login',
    pageTitle: 'Login',
    isAuthentication: false
    });
};

exports.postLogin = (req,res,next)=>{
    User.findById('657e1e44f15620c72f05718e')
    .then(user=>{
        req.session.isLoggeedIn = true;
        req.session.user = user;
        req.session.save(err=>{
            console.log(err);
            res.redirect('/');
        })
    })
    .catch(err=>{
        console.log(err);
    })
};
exports.postLogout = (req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    })
};