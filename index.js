const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require('dotenv/config');

app.use(bodyParser.json());

//mongoose connection
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('connection Succesful');
}).catch((err) => console.log('no successful'));



//Import Routes
const rentDVDRoute = require('./routes/rentDVD');
app.use('/rentDVD', rentDVDRoute);


const port = process.env.port || 5000;
app.listen(port, () => console.log('Server is up'));