const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', () => {
    let server; 

    beforeAll(async () => {
        server = await require('../test_index'); 
    });

    afterAll(async () => { 
        if (server) { 
            await server.close(); 
        }
    });
    
    afterEach(async () => { 
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should retrieve all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre 1'},
                { name: 'genre 2'}
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'genre 1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre 2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return 404 if genreId is not valid', async () => {
            const res = await request(server).get('/api/genres/1'); 
            expect(res.status).toBe(404); 
        });

        it('should return 404 if genreId is not found', async () => {
            const id = mongoose.Types.ObjectId().toHexString();    
            const res = await request(server).get('/api/genres/' + id); 
            expect(res.status).toBe(404); 
        });

        it('should return a genre if genreId matches', async () => {
            const genre = new Genre({ name: 'genre 1' });
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

    });

    describe('POST /', () => {
        let token;
        let name;

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre < 5 characters', async () => {
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre > 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();
            const genre = await Genre.find({ name });
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });

    });
});