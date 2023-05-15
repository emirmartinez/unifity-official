require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


class PasswordHelper  {
    constructor(password, hash) {
        this.password = password,
        this.hash = hash
        
    }

    get passwordEncryption() {
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(this.password, salt);
        return hash
    }

    get checkPassword() {
        let check = bcrypt.compareSync(this.password, this.hash);
        return check
    }

    get verifyPassword() {
        var hash = this.passwordEncryption
        var check = bcrypt.compareSync(this.password, hash);
        return check
    }

    get genToken() {
        this.token = jwt.sign({ password: this.password }, process.env.SECRET, { expiresIn: '1h' });
        return this.token
    }

    get verifyToken() {
        let verify = jwt.verify(this.token, process.env.SECRET);
        return verify.password
    }

    
}

module.exports = PasswordHelper;

