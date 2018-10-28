const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose')
const Joi = require('joi');

//User Schema & Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max:255
    },
    password: {
        type: String,
        min: 8,
        max: 1024,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model('User', userSchema);

function validateUsers(user) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(user, schema); 
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUsers;