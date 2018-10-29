const moment = require('moment');
const request = require('supertest');
const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const mongoose = require('mongoose');



describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .auth('x-auth-token', token)
            .send({ customerId, movieId });

    };

    beforeEach(async () => { 
        server = require('../../index');  
        
        token = User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            title: "the movie",
            genre: { name: 'genre'},
            numberInStock: 1,
            dailyRentalRate: 5
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345678'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 5
            }
        });
        await rental.save();
    });

    afterEach(async () => { 
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });
   
    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });
   
    it('should return 404 if no rental found for customer/movie', async () => {
        await Rental.remove({});
        const res = await exec();

        expect(res.status).toBe(404);
    });
   
    it('should return 400 if return has been processed', async () => {
        rental.returnDate = Date.now();
        await rental.save();
        const res = await exec();

        expect(res.status).toBe(400);
    });
   
    it('should return 200 if return request is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(420);
    });

    it('should set return date for valid request', async () => {
        const res = await exec();
        expect(res.body.returnDate).toBeCloseTo(Date.now());
    });
   
    it('should calculate rental fee for valid request', async () => {
        rental.startDate = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();
        const rentalInDb = Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(35);
    });
   
    it('should increase movie stock upon successful return', async () => {
        const res = await exec();
        movieInDb = Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
   

   
    //should return 400 if customerId is invalid
    //should return 400 if movieId is invalid
    //should return 404 if no rental found for this customer/movie
    //should return 400 if return has been processed
    //should return 200 if valid request
    //should set the return date
    //should calculate the rental fee
    //should increase the stock
    //should return rental summary
});