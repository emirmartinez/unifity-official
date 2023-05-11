const jwt = require('jsonwebtoken');
const PassHelper = require('../lib/passhelper');

function auth(token) {
    var verify;
    try {
        verify = jwt.verify(token, process.env.SECRET);
    } catch (e) {
        return false
    }
    let password = verify.password;
    let helper = new PassHelper(password, null);
    let passToCompare = helper.verifyPassword

    return passToCompare
}

module.exports.auth = auth;