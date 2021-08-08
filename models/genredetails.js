const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    genre: {
        type: String,
        required: true
    },
    moviename: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movielist'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('genredetails', genreSchema);
