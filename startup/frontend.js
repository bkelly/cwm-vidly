const express = require('express');
const helmet = require('helmet');

module.exports = function(app) {
    //Frontent Settings
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());


}