const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    inventorydetails: [{
        moviename: {
            type: String,
            required: true
        },
        rate: {
            type: Number
        },
        status: {
            type: String
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('inventorylist', inventorySchema);
