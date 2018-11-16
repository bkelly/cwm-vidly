const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const request = require('supertest');


//server = require('../../index');

describe('auth middleware', () => {
    let token;
    let server;

    beforeAll(async () => {
        server = await require('../test_index'); 
    });

    afterAll(async () => { 
        if (server) { 
            await server.close(); 
        }
    });
    
    beforeEach(() => { 
        token = new User().generateAuthToken();
    });
    afterEach(async () => { 
        try{
            await Genre.remove({});
            await server.close();     
        } catch(err) {
            console.log("ERROR: ", err.message);
        }
    });

   
    const exec = () => {
        //Returns a promise - remember to await it where you call it
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'validGenre' });
    }


    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = null;
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

});