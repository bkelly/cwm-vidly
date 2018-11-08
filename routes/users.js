const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

//Routes for User
//Retrieve current User
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

//Add a User
router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const email = await User.findOne({email: req.body.email});
    if (email) return res.status(400).send('Invalid email');

    let user = new User(_.pick(req.body, ['name', 'email', 'password']));
    salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
});

//Update a user
router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
//    try {
        const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
//    } catch(err) {
        if (!user) return res.status(404).send(`User with id ${req.params.id} was not found`);
//    }
    res.send(user);
});

//Delete a customer
router.delete('/:id', auth, async (req, res) => {
//    try{
        const user = await User.findByIdAndDelete(req.params.id);
//    } catch(err) {
        if (!user) return res.status(404).send(`User with id ${req.params.id} was not found`);
//    }
    res.send(user);
});

module.exports = router;