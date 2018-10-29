const moment = require('moment');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/api/returns', (req, res) => {
    console.log("req: ", req.body);
    res.status(400).send('Endpoint not available');
})

router.post('/api/returns', auth, async (req, res) => {
    const {error} = validateReturn(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });
    if(!rental) return res.status(404).send('No rental found for this customer or movie');
    if(rental.returnDate) return res.status(400).send('Rental return already processed.');

    rental.returnDate = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    rental = await rental.save();

    await Movie.update({_id: rental.movie._id }, { 
        $inc: {numberInStock: 1}
    });

    return res.status(200).send(rental);
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(req, schema); 
}


module.exports = router;