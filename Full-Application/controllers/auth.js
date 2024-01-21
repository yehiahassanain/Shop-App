const crypto = require('crypto');
const {validationResult} = require('express-validator');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');

const User = require('../models/user');
const sendgridTransport = require('nodemailer-sendgrid-transport');
///// send email 
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}))

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }
       bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
          ///// send email 
          return transporter.sendMail({
            to: email,
            from: 'yehiahassanain@gmail.com',
            subject: 'signup succeded!',
            html: '<h1>your success full signed up!</h1>'
          })
        })
        .catch(err => {
          // res.redirect('/500'); == 
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res,next) => {
  let message = req.flash('error');
  if (message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32,(err,Buffer)=>{
    if (err){
      console.log(err);
      return res.redirect('/reset');
    }
    const Token = Buffer.toString('hex');
    User.findOne({email: req.body.email})
        .then(user=>{
          if (!user){
            req.flash('error','No account with that email found found.');
            return res.redirect('/reset');
          }
          user.resetToken = Token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(result=>{
          res.redirect('/');
           transporter.sendMail({
            to: req.body.email,
            from: 'yehiahassanain@gmail.com',
            subject: 'Password reset',
            html: `
             <p>You requested a password reset</p>
             <p>Click this <a href="http://localhost:3000/reset/${Token}"> Link </a> to set a new password</p>
            `
          })
        })
        .catch(err => {
          // res.redirect('/500'); == 
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
  })
}

exports.getNewPassword = (req,res,next) => {
  const token = req.params.Token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
      .then(user=>{
        let message = req.flash('error');
        if (message.length > 0){
          message = message[0];
        }else{
          message = null;
        }
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
        });
      })
      .catch(err => {
        // res.redirect('/500'); == 
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
}

exports.postNewPassword = (req,res,next) => {
  const NewPassword = req.body.password;
  const passwordToken = req.body.passwordToken;
  const userId = req.body.userId;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
     resetTokenExpiration: {$gt: Date.now()},
      _id: userId
    }).then(user=>{
      resetUser = user;
      return bcrypt.hash(NewPassword,12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save(); 
    })
    .then(result=>{
      res.redirect('/login');
    })
    .catch(err => {
      // res.redirect('/500'); == 
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}