const request = require('supertest');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');

let server; 

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        server.close();
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
            const id = mongoose.Types.ObjectId().toHexString();    
            const res = await request(server).get('/api/genres/' + id); 
            expect(res.status).toBe(404); 
        });

        it('should return a genre if genreId matches', async () => {
            const req = await Genre.collection.insertOne( { name: 'genre 1'} );
            const res = await request(server).get('/api/genres/' + req.insertedId);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'genre 1');
        });

    });
});