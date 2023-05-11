const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    tokens: {
        type: String,
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
