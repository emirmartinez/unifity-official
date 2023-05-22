require('../db/mongoose');
const express = require('express');
const dashboard = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('../model/User');
const cookieParser = require('cookie-parser');
const auth = require('../lib/auth');
const errorMessages = require('../lib/errorMessages');
const passHelper = require('../lib/passhelper');


dashboard.use(cookieParser());
dashboard.use(bodyParser.json({ type: 'application/json' }));
dashboard.use(express.urlencoded({ extended: false }));

dashboard.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: process.env.SECRET
}));


// middleware that is specific to this dashboard
dashboard.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
});

// Auth validation
async function validate(req, res, next) {
    if (req.cookies.access_token) {
        let token = req.cookies.access_token
        let checkCookie = auth.auth(token)
        if (checkCookie) {
            req.validate = true
            next();
        }
    }
    req.validate = false
    next();
}
//Get user data
async function getUser(req, res, next) {
    if (req.cookies.access_token) {
        try {
            let token = req.cookies.access_token
            let user = await User.findOne({ tokens: token })
            res.locals.user = { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
            //Update profile
            if (req.body.profile != undefined) {
                let message = await updateProfile(req.body)
                if (message != "") {
                    res.locals.message = message
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    next()
}

async function updateProfile(body) {
    let message = "";
    if (!body.firstName || !body.lastName || !body.email || !body.password) {
        console.log("Something was left blank")
        message = errorMessages.profile
    } else {
        try {
            let password = new passHelper(body.password);
            updateUser = await User.findByIdAndUpdate({ _id: body.id }, {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: password.passwordEncryption
            })
            console.log("Profile updated successfully")
            message = errorMessages.profileUpdated
        } catch (error) {
            console.log("Catched Error: ", error)
            message = errorMessages.profile
        }
    }
    if (message === "") {
        return
    }
    return message
}

dashboard.use(async function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});


dashboard.use(getUser)
dashboard.use(validate)


dashboard.get('/dashboard', (req, res) => {
    req.validate ? res.render('dashboard') : res.redirect('/login')
});

dashboard.get('/profile', (req, res) => {
    req.validate ? res.render('dashboard/profile') : res.redirect('/login')
});

dashboard.get('/orders', (req, res) => {
    req.validate ? res.render('dashboard/orders') : res.redirect('/login')
});

dashboard.get('/deliveries', (req, res) => {
    req.validate ? res.render('dashboard/deliveries') : res.redirect('/login')
});

dashboard.get('/settings', (req, res) => {
    req.validate ? res.render('dashboard/settings') : res.redirect('/login')
});

dashboard.post('/profile', async (req, res) => {
    req.validate ? res.render('dashboard/profile') : res.redirect('/login')
});

module.exports = dashboard

