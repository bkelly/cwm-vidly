const auth = require('../middleware/auth');
const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose')
const express = require('express');
const Joi = require('joi');
const router = express.Router();


//Routes for Customer

//Get all customers
router.get('/', async (req, res) => {
    const customer = await Customer.find();
    res.send(customer);
});


//Get single customer
router.get('/:id', async (req, res) => {
//    try {
//        console.log('Params id? ', req.params.id);
        const customer = await Customer.findById(req.params.id);
//    } catch(err) {
        if (!customer) return res.status(404).send('Error: customer not found');
//    }
    res.send(customer);
});

//Add a customer
router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
 //TODO - Aggregate error messages into a function

    let customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold 
    });
    customer = await customer.save();
    res.send(customer);
});

//Update a customer
router.put('/:id', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
//    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
//    } catch(err) {
        if (!customer) return res.status(404).send(`Customer with id ${req.params.id} was not found`);
//    }
    res.send(customer);
});

//Delete a customer
router.delete('/:id', auth, async (req, res) => {
//    try{
        const customer = await Customer.findByIdAndDelete(req.params.id);
//    } catch(err) {
        if (!customer) return res.status(404).send(`Customer with id ${req.params.id} was not found`);
//    }
    res.send(customer);
});

module.exports = router;