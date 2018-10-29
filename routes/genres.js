const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


//Routes for Genre

//Get all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);    
});


//Get single genre
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID is not found');
    res.send(genre);
});

//Add a genre
router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
 //TODO - Aggregate error messages into a function
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
});

//Update a genre
router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!genre) return res.status(404).send(`genre with id ${req.params.id} was not found`);
    res.send(genre);
});

//Delete a genre
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send(`genre with id ${req.params.id} was not found`);
    res.send(genre);
});


module.exports = router;