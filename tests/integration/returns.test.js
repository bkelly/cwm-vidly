const {Rental} = require('../../models/rental');
const mongoose = require('mongoose');



describe('/api/returns', () => {
    let server;
    let customerID;
    let movieID;
    let rental;

    beforeEach(async () => { 
        server = require('../../index');  

        customerID = mongoose.Types.ObjectId();
        movieID = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerID,
                name: '12345',
                phone: '12345678'
            },
            movie: {
                _id: movieID,
                title: '12345',
                dailyRentalRate: 5
            }
        });
        await rental.save();
    });
    
    afterEach(async () => { 
        server.close();
        await Rental.remove({});
    });

    it('should work', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

});