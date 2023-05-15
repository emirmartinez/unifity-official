require('../db/mongoose');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const errorMessages = require('../lib/errorMessages');
const User = require('../model/User');
const passHelper = require('../lib/passhelper');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const auth = require('../lib/auth')

router.use(cookieParser());
router.use(bodyParser.json({ type: 'application/json' }));
router.use(express.urlencoded({ extended: false }))

router.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: process.env.SECRET
}));
router.use(async function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
});

//Homepage
router.get('/', (req, res) => {
    res.render('index')
});


//Sign Up
router.get('/sign-up', (req, res) => {
    res.render('sign-up')
});
router.post('/sign-up', async (req, res) => {
    let fname = req.body.firstName;
    let lname = req.body.lastName;
    let email = req.body.email;

    try {
        //Check if user already exist
        let user = await User.findOne({ email })
        //Register user if it doesn't exist
        if (!user) {
            let password = new passHelper(req.body.password);
            let register = new User({
                firstName: fname,
                lastName: lname,
                email: email,
            });
            //Encrypt password and generate token to save to DB
            register.password = password.passwordEncryption;  
            // register.tokens = password.genToken
            register = await register.save();
            res.render('login');
        } else {
            //If user already exist send error message
            req.session.error = errorMessages.signUp
            res.redirect('/sign-up')
        }
    } catch (error) {
        console.log(error)
        req.session.error = errorMessages.signUp
        res.redirect('/sign-up')
    }
});

//Login
router.get('/login', (req, res) => {
    res.render('login')
});
router.post('/login', async (req, res) => {
    let email = req.body.email;
    try {
        //Check if user already exist
        let user = await User.findOne({ email })
        //Compare passwords
        let compare = new passHelper(req.body.password, user.password);
        let check = compare.checkPassword;
        //If password match redirect to dashboard
        if (check) {
            let token = jwt.sign({ password: req.body.password, }, process.env.SECRET, { expiresIn: '3h' });
            if (!user.tokens) {
                setToken = await User.updateOne({ _id: user._id }, { tokens: token })
                res.cookie('access_token', token);
                res.redirect('/dashboard');
            } else {
                try {
                    let verify = jwt.verify(user.tokens, process.env.SECRET);
                    if (verify.password === req.body.password) {
                        console.log('Token verified successfully')
                        res.cookie('access_token', user.tokens)
                        res.redirect('/dashboard');
                    }
                } catch (error) {
                    setToken = await User.updateOne({ _id: user._id }, { tokens: token })
                    res.cookie('access_token', token);
                    res.redirect('/dashboard');
                }
            }
        } else {
            //No match redirect back to login with error
            console.log('Wrong email or password')
            req.session.error = errorMessages.login
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
        req.session.error = errorMessages.login
        res.redirect('/login')
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('access_token')
    res.redirect('/login')
})

router.post('/webhook', (req, res) => {
    console.log(req.body)
})

module.exports = router