const mongoose = require('mongoose')
const Joi = require('joi');

//Genre Schema & Model
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);


function validateGenres(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema); 
}



exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenres;
