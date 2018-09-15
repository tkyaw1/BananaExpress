const express = require('express');
const fetch = require('node-fetch')
const moment = require('moment')
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
    "origin": "*",
    "methods": "GET,POST",
    "allowedHeaders": ['Origin, X-Requested-With, Content-Type, Accept'],
    "credentials": true
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    // while (!detected) {
    //     continue
    // }

    res.send({ 'Express': 'Hello!' })
});

// routes for phone
app.post('/mobile/images/:id', (req, res) => {
    // extract location & timestamp
    // send to im2txt
    // send to google cloud vision
})
app.get('/mobile/location/:id', (req, res) => {
    // if they were at this location for a long time (10min+?)
    // send to places api
    // create map snippet (maybe this should be done on front end?)
    // get caption for location
    // send back to front end
})

// routes for web app
app.get('/client/text/:id', (req, res) => {
    // user sends text, send back list of prompts
})

app.get('/client/blocks/:id', (req, res) => {
    // user sends hello ping, server sends back a block if there is data available
    // we'll use an id to differentiate entries for different days
})

app.get('/client/fitbit/:id', (req, res) => {
    // user sends fitbit activity data here
})

// get list of places
function getPlacesFromCoordinates() {
    // query GOOGLE PLACES
    // return best place
}

// cloud vision
function queryCloudVision() {
    // get back labels, moods, landmarks

    // if has mood, add interval

    // if has landmark, add to backend user tag dictionary

    //
}

// im2txt
function im2txt() {
    // get back caption
}

app.listen(port, () => console.log(`Listening on port ${port}`));
