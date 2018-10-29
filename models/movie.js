const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');

//Movie Schema & Model
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 280
    },
    genre: {
        type: genreSchema
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});
const Movie = mongoose.model('Movie', movieSchema);


async function createMovie(title, genreID) {
    const movie = new Movie({
        title,
        genreID
    });
    const result = await movie.save();
    console.log(result);
}


function validateMovies(movie) {
    const schema = {
        title: Joi.string().min(3).max(280).required(),
        genreID: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    return Joi.validate(movie, schema); 
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validate = validateMovies;
