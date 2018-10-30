const moment = require('moment');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);  
const {movieSchema} = require('./movie');
const {customerSchema} = require('./customer'); 

//Rental Schema & Model
const rentalSchema = new mongoose.Schema({
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
});

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

rentalSchema.methods.return = function() {
    this.returnDate = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};


const Rental = mongoose.model('Rental', rentalSchema);


function validateRental(rental) {
    const schema = {
        movieID: Joi.objectId().required(),
        customerID: Joi.objectId().required(),
    };
    return Joi.validate(rental, schema); 
}



exports.Rental = Rental;
exports.validate = validateRental;
