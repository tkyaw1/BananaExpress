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
        'location': ['Malibu', 'Hawaii'],
        'type': "activity"
    },
    'running': {
        'date': ["20180802"],
        'pos': "verb-ing",
        'location':['Swarthmore'],
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

app.locals.dashboards = {
    '9-14-2018': {
        'temperature': 80,
        'steps': 11000,
        'sleep': '9 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    '9-15-2018': {
        'temperature': 80,
        'steps': 8000,
        'sleep': '9 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    '9-16-2018': {
        'temperature': 80,
        'steps': 8000,
        'sleep': '9 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    }
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
app.get('/mobile/images/:id', (req, res) => {
    // extract location & timestamp
    // send to im2txt
    // send to google cloud vision
    console.log('received req')
    const current_dict = JSON.stringify(app.locals.keyword_dict);
    console.log(current_dict)
    const url = 'https://00e9e64bac3ec45fbf7351076a5d0cedd00fe559982aa97a0a-apidata.googleusercontent.com/download/storage/v1/b/project-tao/o/kastanByLake.jpg?qk=AD5uMEtMK82qMa5XXRp_4c2pmibzF18BrsTZ2FPw658SV_tpaz8Vh6KmnfxascAWW4KRW0f9L2iqwgbLl7oZZJUyerwSDZlGSreEGXtwqUh8ni_E3hgh7i_qr_l6cL67f5FZvX9E_Tyc7stT8LGHJMiHoSLRpC_SYdFgMCMlJ5UIGTh39Rw03pIb2pxciULJ2CXBU93P_VLua0nc4gKBDhWWlBJPg9wVEuZcmyoMVPGCVjpdh32ima2dxc-crIWpoS-WO_6fYODPKZVqTh6fLWSqLLDbeKPSqpQwUiaNO_uInwbA1PZuNljBV1TDRXVg-YQRzPqbXULH24XmnxKPAOp9sMwvlmvhg15AQBUW2NPfrT_okHYyD3yPo0HD_mM4CfTWhmViDyY_dCSLLtoSAEsMCzq5v9NKEH_9KfGnDVf0Z4GxhlP22Evk5Ey_DLJVfOrSZrkNlSgLspzfviG50xi89TJfpPmzsMpRRH0qORH3ARGkN8sdHxZXX71tagb6wE5XhLS6JcEmumUrXOs0zYjP_soNHivFayzMW2mLN9bxbeOtxGYhfsY7U4HWpDjDDNzi8J-1E9mTIhoaoRaAndCph3AG8g1gi1VHNWf6I2RrMH4tcpXsQaWqNffnasL6zat3LhsZ7XLk7K8mFQbofYYWiqAbSlsYsnYcTimXJSBvK5bST2BLwPjAo_GTV9AuNWVOTk-KNKJ9xt-rtesbJ0lG6Z45cf2yrSGcAf1DuST7DZfGEMMGDpoGLStmZFR6dEyQ3Og7NvyZ'
    const pythonProcess = spawn('python', ["gcloud/im2Prompt.py", url, current_dict]);
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString('utf8'))
        res.send({ 'Express': 'Hello!' })
    })
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
    if (req.params.id == 'reset') {
        console.log('resetting prompts!!')
        app.locals.prompts = {
            'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
        }
    }
    let prompts = app.locals.prompts[day]
    console.log(prompts)
    res.send({ prompts: prompts});
})

// routes for web app
app.post('/client/text/:id', (req, res) => {
    // user sends text, send back list of prompts
    console.log(req.body.newSentence)
    const pythonProcess = spawn('python', ["question_generation.py", JSON.stringify(app.locals.keyword_dict), JSON.stringify(app.locals.corpus), req.body.newSentence]);
    let day = 'test'
    var newPrompts = app.locals.prompts[day]
    pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        // var temp = JSON.parse(data.toString());
        // console.log(data.toString('utf8'))
        // newPrompts.push(data)
        // var array = JSON.parse(data.toString())
        var strings = data.toString('utf8').split("\n");
        strings.pop()
        // dataString = dataString.substring(0, dataString.length-1);
        // console.log(JSON.parse(dataString))
        let mergedPrompts = newPrompts.concat(strings)
        // console.log(mergedPrompts)
        req.app.locals.prompts[day] = mergedPrompts
        // var textChunk = data.toString('utf8');
        console.log('updating prompts:', app.locals.prompts[day])
        res.send({ prompts: newPrompts });
    });
    // console.log('new prompts: ', newPrompts);
})

app.get('/client/blocks/:id', (req, res) => {
    // user sends hello ping, server sends back a block if there is data available
    // we'll use an id to differentiate entries for different days
    // console.log('received block request!')
    if (req.params.id == 'reset') {
        app.locals.hasNewBlocks = true
        app.locals.prompts = {
            'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
        }
    }
    const hasNewBlocks = app.locals.hasNewBlocks
    app.locals.hasNewBlocks = false
    // console.log(hasNewBlocks)
    if (hasNewBlocks) {
        console.log(createRockClimbingBlock())
        res.send({ blocks: [createRockClimbingBlock()], hasNewBlocks: hasNewBlocks });
        console.log('sent block back')
    }
})

app.get('/client/fitbit/:id', (req, res) => {
    // user sends fitbit activity data here
})

function createMiniBlockFromType(type, data) {
    if (type == 'image') {
        return {
                    "object": "block",
                    "type": type,
                    "data": {
                        "src": data,
                        "emojis": "🧗‍♂️🌲",
                        "mood": "😀"
                    }
                }
    } else {
        return {
            "object": "block",
            "type": type,
            "nodes": [
                {
                    "object": "text",
                    "leaves": [
                        {
                            "text": data
                        }
                    ]
                }
            ]
        }
    }
}

function createBlockFrom(block) {
    var parsedBlock = block.map(miniBlock => { 
        return createMiniBlockFromType(miniBlock['type'], miniBlock['data'])
    })

    parsedBlock.push(createMiniBlockFromType('paragraph', 'Start typing here and more prompts will magically pop up!\nTry it out for yourself!'))
    return {
        "document": {
            "nodes": parsedBlock
        }
    }
}

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

function createRockClimbingBlock() {
    let timestamp = '11:30 am ☀️'
    let caption = 'Rock climbing at Rumney in the morning'
    let image = "https://lh3.googleusercontent.com/uvrsxcQ4isRnWlw8Q3f7V4ToaTGB7Q9eW7jXGYbR68HdjZrBZT2K4OCxPMvDjrXRqbdRzS3u-GLvdHeaIAUsFl0UB2PjDeL0zy5to0u3Lwfahi-ZDcu2PezOsaP5IiYhhhqYMlSAg5xpLhRmeQa4jnEB9Y5YVStlDRwkH_2y57u1FWwr5RW9nSjXZPCX1HrtbMM_Qeg5JwPkkweL7LoYhpGcD0AAEKjKiAVIxu6HdDejYwkK7dDu2pjlOlPGkePeWuWTBwTuFRnPscN-ZSZbytN1AXku_QwKUQBLCRWQZtli0MswyXx9k8n5usTzFAi4UMOEMV7E-8JUxoApUEnVqRmjmUwAwVGZv1QVXUdV8Z-E38frlPI3UX_mw4GA0Ey1tfsgjtalE-G6qRpLPXz9uJtUdpg9WHUttCbrkYI4Z1JnrZG-Bpsd_slKiPgmL7nIWzUzlZfT43UQEtqmIQ367bYkj1F1MG23Kw8ZFaKwmugW772g0xi-MISFVtr3sWxiV2AiN9_lYaBPh4J-BR0sALoYKPNDcmqzBcBmUahzy7Dpojy1X_ceTryOQQfq09Fuy1Dhwai2Z0PDPRrrHlExapkn8uCWKX5KMIEQfF7AEPwnDLZqFy5bRYbveSBHu2A=w738-h984-no"
    let imagePrompt = "How did rock climbing go?"

    let block = [
        {'type': 'timestamp', 'data': timestamp}, 
        {'type': 'caption', 'data': caption}, 
        {'type': 'image', 'data': image}, 
        {'type': 'imagePrompt', 'data': imagePrompt}, 
    ]
    return createBlockFrom(block)
}

// im2txt
function im2txt() {
    // get back caption
}

app.listen(port, () => console.log(`Listening on port ${port}`));
