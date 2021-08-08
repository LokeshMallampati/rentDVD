const mongoose = require('mongoose');

const movielistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    caseandcrew: {
        type: String,
        required: true
    },
    availableforrent: {
        type: String,
        required: true
    },
    totaldvdavailableforrent: {
        type: Number,
        required: true
    },
    rentCharge: {
        type: Number,
        required: true
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genredetails'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movielist', movielistSchema);
