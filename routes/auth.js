const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {User} = require('../models/user');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

//Routes for User

//Add a User
router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
 //TODO - Aggregate error messages into a function

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');
    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = {
         email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(req, schema); 
}


module.exports = router;