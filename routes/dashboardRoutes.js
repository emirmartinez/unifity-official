require('../db/mongoose');
const express = require('express');
const dashboard = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('../model/User');
const cookieParser = require('cookie-parser');
const auth = require('../lib/auth')

dashboard.use(cookieParser());
dashboard.use(bodyParser.json({ type: 'application/json' }));
dashboard.use(express.urlencoded({ extended: false }))

dashboard.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: process.env.SECRET
}));
dashboard.use(function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

// middleware that is specific to this dashboard
dashboard.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
});

function getUser(req, res, next) {
    let user = {
        firstName: "John",
        lastName: "Smith",
    }
    res.locals.user = user
    next()
}

// Auth validation
async function validate(req, res, next) {
    if (req.cookies.access_token) {
        let token = req.cookies.access_token
        let checkCookie = auth.auth(token)
        if (checkCookie) {
            req.validate = true
            next()
        }
    }
    req.validate = false
    next()
}

dashboard.use(validate)
dashboard.use(getUser)


dashboard.get('/dashboard', (req, res) => {
    req.validate ? res.render('dashboard') : res.redirect('/login')
});

dashboard.get('/account', (req, res) => {
    req.validate ? res.render('dashboard/account') : res.redirect('/login')
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


module.exports = dashboard