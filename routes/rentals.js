const auth = require('../middleware/auth');
const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const router = express.Router();


Fawn.init(mongoose);
//Routes for Rentals

//Get all Rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-rentalStartDate')
    .populate('movie', 'title -_id')
    res.send(rentals);
});


//Get single Rental
router.get('/:id', async (req, res) => {
//    try {
        const rental = await Rental.findById(req.params.id);
//    } catch(err) {
        if (!rental) return res.status(404).send('Error: Rental not found');
//    }
    res.send(rental);
});

//Add a Rental
router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //TODO - Aggregate error messages into a function

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Movie not found');
    if (movie.numberInStock === 0) return res.status(400).send('No stock available');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Customer not found');

    let rental = new Rental({ 
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            id_: customer._id,
            isGold: customer.isGold,
            name: customer.name,
            phone: customer.phone
        },
    });
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(rental);
    } catch(err) {
        res.status(500).send('Could not save rental...');
    }
});

module.exports = router;