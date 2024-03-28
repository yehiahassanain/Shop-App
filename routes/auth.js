const express = require('express');
const { check,body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:Token', authController.getNewPassword);

router.post('/login',  
            [
                body('email').isEmail()
                .withMessage('please enter a valid email.')
                .normalizeEmail()
                .custom((value, {req})=>{
                    if (value==='test@test.com'){
                        throw new Error('this email address if forbidden.');
                    }
                    return true;
                }),
                body(
                    'password',
                    'password has to be valid'
                )
                .isLength({min: 5})
                .isAlphanumeric()
                .trim()        
            ],
           authController.postLogin);

router.post(
    '/signup',
    [
        check('email').isEmail()
        .withMessage('please enter a valid email.')
        .custom((value, {req})=>{
            // if (value==='test@test.com'){
            //     throw new Error('this email address if forbidden.');
            // }
            // return true;
           return User.findOne({ email: value })
            .then(userDoc => {
            if (userDoc) {
                return Promise.reject(
                    'E-Mail exists already, please pick a different one.'
                );
            }
         });
        })
        .normalizeEmail(),
        body(
            'password',
            'please enter a password with only numbers and text and at least 5 characters'
        )
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, {req})=>{
            if (value!==req.body.password){
                throw new Error('password have to match');
            }
            return true;
        })
    ],
    authController.postSignup
    );

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);
module.exports = router;