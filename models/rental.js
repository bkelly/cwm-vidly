const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);  
const {movieSchema} = require('./movie');
const {customerSchema} = require('./customer'); 

//Rental Schema & Model
const Rental = mongoose.model('Rental', new mongoose.Schema({
    movie: {
        type: movieSchema,
        required: true,
    },
    customer: {
        type: customerSchema,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    returnDate: {
        type: Date
    },
    rentalFee: Number
}));


function validateRental(rental) {
    const schema = {
        movieID: Joi.objectId().required(),
        customerID: Joi.objectId().required(),
    };
    return Joi.validate(rental, schema); 
}



exports.Rental = Rental;
exports.validate = validateRental;
