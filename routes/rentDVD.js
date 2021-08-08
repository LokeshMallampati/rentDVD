const express = require('express');
const router = express.Router({ mergeParams: true });
const movieinfo = require('../models/movielist');
const genredetails = require('../models/genredetails');
const inventoryinfo = require('../models/inventorylist');

//Submit a post
//http://localhost:5000/rentDVD/addmovieinfo
router.post('/addmovieinfo', (req, res) => {
    //add movieinfo
    const addmovieinfo = new movieinfo({
        name: req.body.name,
        description: req.body.description,
        caseandcrew: req.body.caseandcrew,
        availableforrent: req.body.availableforrent,
        totaldvdavailableforrent: req.body.totaldvdavailableforrent,
        rentCharge: req.body.rentCharge
    });
    //Add genre info
    const savegenredetails = new genredetails({
        genre: req.body.genre,
        moviename: addmovieinfo._id
    });
    
    //Add genre relation to movie 
    addmovieinfo.genre = savegenredetails;

    addmovieinfo.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });

    savegenredetails.save()
        .catch(err => {
            res.json({ message: err });
        });;
});

//http://localhost:5000/rentDVD/getmovieinfo
router.get('/getmovieinfo', async (req, res) => {
    try {
        const posts = await movieinfo.find().populate('genre');
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

//http://localhost:5000/rentDVD/moviename/Wai
//Specific posts by name
router.get('/moviename/:name', async (req, res) => {
    try {
        let PartialToMatch = new RegExp(req.params.name, 'i');
        const posts = await movieinfo.find({ name: PartialToMatch });
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

//http://localhost:5000/rentDVD/page?page=2&size=2
//Specific posts by page
router.get('/page', async (req, res) => {
    let { page, size } = req.query;
    if (!page) {
        page = 1
    }
    if (!size) {
        size = 10
    }

    const limit = parseInt(size);
    const skip = (page - 1) * size

    const posts = await movieinfo.find().limit(limit).skip(skip);
    res.send(posts);

});



//http://localhost:5000/rentDVD/genre/Romance
//Specific posts by genere
router.get('/genre/:genre', async (req, res) => {
    try {
        const genre = await genredetails.find({ genre: req.params.genre }).populate('moviename', 'name');
        res.json(genre);
    } catch (err) {
        res.json({ message: err });
    }
});

//http://localhost:5000/rentDVD/id/610ef57d5837cf2bb051d4ed
//Specific posts by postId
router.get('/id/:id', async (req, res) => {
    try {

        const posts = await movieinfo.findOne({ _id: req.params.id }).populate('genre');
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

//http://localhost:5000/rentDVD/RentCheck/
//send movie array
router.get('/RentCheck', async (req, res) => {
    try {
        var inventorydetailsArray = {}
        var key = 'inventorydetails';
        inventorydetailsArray[key] = [];

        for (const val of req.body.moviename) {
            const movie = await movieinfo.find({ name: val.name }, { name: 1, rentCharge: 1, _id: 1, totaldvdavailableforrent: 1 }).populate('genre', 'genre');
            if (movie[0] != undefined && movie[0].totaldvdavailableforrent > 0) {
                var data = {
                    moviename: movie[0].name,
                    rate: movie[0].rentCharge,
                    status: 'DVD booked'
                };
                inventorydetailsArray[key].push(data);
                //update
                await movieinfo.updateOne(
                    { _id: movie[0]._id },
                    { $set: { totaldvdavailableforrent: movie[0].totaldvdavailableforrent - 1 } }
                );
            }
            else {
                var data = {
                    moviename: val.name,
                    status: 'Out of Stock'
                };
                inventorydetailsArray[key].push(data);
            }
        }
        JSON.stringify(inventorydetailsArray);
        const inventorydetailinfo = new inventoryinfo({
            inventorydetails: inventorydetailsArray.inventorydetails
        });
        inventorydetailinfo.save()
            .then(data => {
                res.json(data);
            });
    }
    catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;