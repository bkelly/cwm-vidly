#!/usr/bin/sh

mongoimport --db vidly --collection genres --drop --file genres-data.json --jsonArray
mongoimport --db vidly --collection customers --drop --file customer-data.json --jsonArray
mongoimport --db vidly --collection movies --drop --file movie-data.json --jsonArray
