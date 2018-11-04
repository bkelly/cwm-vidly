const auth = require('../middleware/auth');
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();


//Routes for Movie

//Get all movies
router.get('/', async (req, res) => {
    const movies = await Movie.find()
    .populate('genre', 'name -_id')
    .select('title genre');
    res.send(movies);
});


//Get single Movie
router.get('/:id', async (req, res) => {
//    try {
        const movie = await Movie.findById(req.params.id);
//    } catch(err) {
        if (!movie) return res.status(404).send('Error: Movie not found');
//    }
    res.send(movie);
});

//Add a Movie
router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
 //TODO - Aggregate error messages into a function
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid Genre');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
 
    await movie.save();
    res.send(movie);
});

//Update a Movie
router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
//    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
//    } catch(err) {
        if (!movie) return res.status(404).send(`Movie with id ${req.params.id} was not found`);
//    }
    res.send(movie);
});

//Delete a Movie
router.delete('/:id', auth, async (req, res) => {
//    try{
        const movie = await Movie.findByIdAndDelete(req.params.id);
//    } catch(err) {
        if (!movie) return res.status(404).send(`Movie with id ${req.params.id} was not found`);
//    }
    res.send(movie);
});


module.exports = router;