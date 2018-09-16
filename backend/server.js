const express = require('express');
const fetch = require('node-fetch')
const moment = require('moment')
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const spawn = require("child_process").spawn;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
    "origin": "*",
    "methods": "GET,POST",
    "allowedHeaders": ['Origin, X-Requested-With, Content-Type, Accept'],
    "credentials": true
}

app.use(cors(corsOptions));

app.locals.keyword_dict = {
    'swim': {
        'date': ["20180915", "20180916"],
        'pos': "verb",
        'type': "activity"
    },
    'running': {
        'date': ["20180802"],
        'pos': "verb-ing",
        'type': "activity"
    }
}

app.locals.corpus = {
    'corpus': [
        'test',
        'test'
        //list of all the text
        // ['block's text', 'block's text']
    ]
}

app.locals.hasNewBlocks = true

app.locals.prompts = {
    'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
}

// i pass keyword_dict, corpus, current_text at once to Henry/python
// i get back prompts

app.get('/', (req, res) => {
    // while (!detected) {
    //     continue
    // }
    console.log('received get req!!')
    res.send({'Express': 'Hello!'})
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
app.get('/client/prompts/:id', (req, res) => {
    // user sends text, send back list of prompts
    // const pythonProcess = spawn('python', ["question_generation.py", app.locals.keyword_dict, app.locals.corpus, req.params.id]);
    // pythonProcess.stdout.on('data', (data) => {
    //     // Do something with the data returned from python script
    //     var textChunk = data.toString('utf8');
    //     console.log(textChunk)
    // });
    let day = 'test'
    let prompts = app.locals.prompts[day]
    res.send({ prompts: prompts});
})

// routes for web app
app.post('/client/text/:id', (req, res) => {
    // user sends text, send back list of prompts

    const pythonProcess = spawn('python', ["question_generation.py", JSON.stringify(app.locals.keyword_dict), app.locals.corpus, req.params.id]);
    pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        // var temp = JSON.parse(data.toString());
        console.log(data.toString());
        var textChunk = data.toString('utf8');
        res.send({ prompts: [textChunk] });
    });
})

app.get('/client/blocks/:id', (req, res) => {
    // user sends hello ping, server sends back a block if there is data available
    // we'll use an id to differentiate entries for different days
    // console.log('received block request!')
    if (req.params.id == 'reset') {
        app.locals.hasNewBlocks = true
    }
    const hasNewBlocks = app.locals.hasNewBlocks
    app.locals.hasNewBlocks = false
    // console.log(hasNewBlocks)
    if (hasNewBlocks) {
        res.send({ blocks: [createJsonBlock()], hasNewBlocks: hasNewBlocks });
        console.log('sent block back')
    }
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

function createJsonBlock(type) {
    var type = 'heading'
    var text = 'Your First Header'
    return {
        "document": {
            "nodes": [
                {
                    "object": "block",
                    "type": type,
                    "nodes": [
                        {
                            "object": "text",
                            "leaves": [
                                {
                                    "text": text
                                }
                            ]
                        }
                    ]
                }, 
                {
                    "object": "block",
                    "type": "paragraph",
                    "nodes": [
                        {
                            "object": "text",
                            "leaves": [
                                {
                                    "text": "Start typing here and more prompts will magically pop up!"
                                }
                            ]
                        }
                    ]
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "nodes": [
                        {
                            "object": "text",
                            "leaves": [
                                {
                                    "text": "Try it out for yourself!"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    } 
}

// im2txt
function im2txt() {
    // get back caption
}

app.listen(port, () => console.log(`Listening on port ${port}`));
