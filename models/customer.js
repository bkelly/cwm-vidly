const mongoose = require('mongoose')
const Joi = require('joi');

//Customer Schema & Model
const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    phone: {
        type: String,
        required: true,
        min: 8
    }
});
const Customer = mongoose.model('Customer', customerSchema);

function validateCustomers(customer) {
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(8).required(),
        isGold: Joi.boolean
    };
    return Joi.validate(customer, schema); 
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomers;
