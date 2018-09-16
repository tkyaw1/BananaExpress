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
    'fishing': {
        'date': ["Sep-11-2018", "Sep-12-2018"],
        'pos': "VBG",
        'location': ['San Francisco, CA', 'Wenatche, WA'],
        'type': "activity",
        'comp': [["Sep-11-2018",'San Francisco, CA'], ["Sep-12-2018", "Wenatche, WA"]]
    },
    'bridge': {
        'date': ["Sep-13-2018", "Sep-16-2018"],
        'pos': "NN",
        'location': ['San Francisco, CA', 'Wenatche, WA'],
        'type': "location",
        'comp': [["Sep-13-2018",'San Francisco, CA'], ["Sep-16-2018", "Wenatche, WA"]]
    },
    'boat': {
        'date': ["Sep-13-2018", "Sep-16-2018"],
        'pos': "NN",
        'location': ['San Francisco, CA', 'Wenatche, WA'],
        'type': "activity",
        'comp': [["Sep-13-2018",'San Francisco, CA'], ["Sep-16-2018", "Wenatche, WA"]]
    },
    'golfing': {
        'date': ["Sep-13-2018"],
        'pos': "VBG",
        'location':['San Francisco, CA'],
        'type': "activity",
        'comp': [["Sep-13-2018", "San Francisco, CA"]]
    },
    'Golden Gate Bridge': {
        'date': ["Sep-13-2018"],
        'pos': "NN",
        'location':['San Francisco, CA'],
        'type': "location",
        'comp': [["Sep-13-2018", "San Francisco, CA"]]
    },
    'boating': {
        'date': ["Sep-14-2018"],
        'pos': "VBG",
        'location':['San Francisco, CA'],
        'type': "activity",
        'comp': [["Sep-14-2018", "San Francisco, CA"]]
    },
    'camping': {
        'date': ["Sep-14-2018"],
        'pos': "VBG",
        'location':['Wenatche, WA'],
        'type': "activity",
        'comp': [["Sep-14-2018", "Wenatche, WA"]]
    },
    'sunset chasing': {
        'date': ["Sep-14-2018"],
        'pos': "VBG",
        'location':['Big Sur, CA'],
        'type': "activity",
        'comp': [["Sep-14-2018", "Big Sur, CA"]]
    },
    'San Francisco, CA': {
        'date': ["Sep-13-2018"],
        'pos': "NN",
        'location' : ['San Francisco, CA'],
        'type': 'location',
        'comp': [["Sep-13-2018", "San Francisco, CA"]]
    },
    'Wenatche, WA': {
        'date': ['Sep-16-2018'],
        'pos': 'NN',
        'location': ['Wenatche, WA'],
        'type': 'location',
        'comp': [["Sep-16-2018", "Wenatche, WA"]]
    },
    'Big Sur, CA': {
        'date': ['Sep-14-2018'],
        'pos': 'NN',
        'location' : ['Big Sur'],
        'type': 'location',
        'comp':[["Sep-14-2018", "Big Sur, CA"]]
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

app.locals.storedDays = [[], [], [], [], [], [], []]

app.locals.storedBlocks = []

app.locals.dashboards = [
    {
        'temperature': 75,
        'steps': 13400,
        'sleep': '8 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    {
        'temperature': 81,
        'steps': 11000,
        'sleep': '7 hr 45 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    {
        'temperature': 60,
        'steps': 13020,
        'sleep': '6 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    {
        'temperature': 80,
        'steps': 11000,
        'sleep': '9 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    {
        'temperature': 75,
        'steps': 8050,
        'sleep': '7 hr 30 min',
        'weather': 'lightning',
        'mood': 'grinSweat'
    },
    {
        'temperature': 85,
        'steps': 4570,
        'sleep': '0 hr 0 min',
        'weather': 'sunny',
        'mood': 'tired'
    }
]

app.locals.emojis = ['☀️', '☀️','☀️','☀️','☀️','☀️','🌤','🌤','🌤','⛅️','⛅️','⛅️', '🌥','🌦', '🌧', '⛈', '🌩','🌨','️☔️','☂️']

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

    let block0 = [
        {'type': 'timestamp', 'data': '10:30 am'},
        {'type': 'caption', 'data': 'Fishing in San Francisco'},
        {'type': 'image', 'data': 'https://lh3.googleusercontent.com/QNAGaeh56uiuQSB_EXJr_RIl-b7P43UDmcyKfmEhrnRDFQVeqaJzeGOq192jqFFtcUb2cxmR0iBPEtc8LwvxfSZMNdinr7VlmJZb7gfbWb9Zou0a-pTuGlu-VLkdPP24LiFnD07Pbo1fBtp2UE2tYlOJmeyElwif1Wjs3Qqjn8b90bSCIpCxad2jarjV1wnOylp5wLdE5KxtiqZ0520wHf8ueZhDRNbNsZGJhkfNU9WTuLGy1fm7g0SCq0KgdABsBwnRd2teRzqRIgMxHrYaXRUXXGDqgl2cpkCdFaCvuTi6doIB33VtL2ZKT_e8hBT7n3Q3rAjZyiR7NjT5Dqmvu3-03G3IMgiYA9fPP_Kav_8A0Rq2RiVbTGxjhYryeR-Jo6gZBH-ePdWwEvWWE6eRkHspvlwib9uKDF6ZCrBTFTHxhSeiobUK91of2pTUl2Mb7s1Iq92mUbxbq5PPbB0e6JY8Xlh4i_sBI4ueAHTLablcw3BkQvSICO1d47FJFnJAeX6jMyP-VEAmYHMgSDm_P3yPRnEcn5mUAsjAzpgixboj473pY-oX33DfkuGFI90w4Qw_js5aq9x7jVSuC1L5Wx0Gavtvz_qOxJIu3_yTQKN622MpQ6NC415AKN4lf55j5CV6BPBYh0kS405eZC8zVFkd48ViALUilniS0L8o6r4tumE7YAMxAyeAyQ=w572-h763-no'},
        {'type': 'imagePrompt', 'data': 'How was fishing today?'},
        {'type': 'paragraph', 'data': '\nI\'m so happy to be fishing with friends today. I walked up the shore and admired the mountains. '}
    ]
    let block1 = [
        {'type': 'timestamp', 'data': '9:30'},
        {'type': 'caption', 'data': 'Surfing at Ocean B'},
        {'type': 'image', 'data': 'https://lh3.googleusercontent.com/Yu0cZlBHluyPIREL1xD1DzEvVrVaV0wjRDHpT8WuktrPzKtEs3RNLbFZzilYbJdAtKBRAL_EAb9S-CdFqNUSs5Y4ubxSQba-82M9QsNocjrh8YTRjLKjWubNgjhdkgBR5qI6xmyUUkdmJtNt8onoNDbVaFuemg5BbyVYSWR0_ykO5CSx9CNUmgIkhCEd8abRn34nFT2patgRV278sxheH-ijDIptQpiwsGA6PyeMAK3P-bBokI5GcKN5E0yWAfEyrntHireoSmItClMx_VxYiOo-qTpKU5eHuQamhMS5Loem-mxxeeFwzKN7DKhTWfYUJTgje6ByMhdu5sKkfHefe_DwkayhWF07GMuCe4a_14H2Aey-if9e8HsMO42B4ns7pTxjl852EZgWOSPzuIN5bI2pxJedy5B4MHjvGURAoX0fgYAGW80tMePMkpjPn57KCMKNur-eNdE_h4KK3toQlenv85uG9gOkbp_04wjOsWz0mEZz2CU50D83dcsjSvcBRvy8hupvADjiixSczY43bWnSuakBAvg60v75aU0_R2VOiQRtB5nW883PceKgrGRPHFdIoaw3oh7i0GZdnExENi7k5OOqAaT2p_BHTyUgQK8UYKyaVFFGE08_P_V3BVve-DDj9chdyRib6rc5fy0JR5KQHgzH3ukwzl8JsWRJx7qT0HLaorovMSRJ=w670-h1188-no'},
        {'type': 'imagePrompt', 'data': 'Who were you with today?'},
        {'type': 'paragraph', 'data': 'San Francisco is an incredibly vibrant city. I loved continually walking the streets, and I even went running along the boardwalk.  I loved the Golden Gate bridge.. '},
    ]
    let block2 = [
        {'type': 'timestamp', 'data': '11:30'},
        {'type': 'caption', 'data': 'Golden Gate in San Francisco'},
        {'type': 'imagePrompt', 'data': 'What did you like San Francisco?'},
        {'type': 'image', 'data': 'https://storage.cloud.google.com/project-tao/GoldenGate.jpg'},
        {'type': 'paragraph', 'data': '\nToday we drove across the Golden Gate Bridge! As always, Karl the fog gave us a very San Franciscan welcome. '},
    ]

    let block3 = [
        {'type': 'timestamp', 'data': '1:30'},
        {'type': 'caption', 'data': 'Camping in Wenatche, WA'},
        {'type': 'imagePrompt', 'data': 'What did you like about camping?'},
        {'type': 'image', 'data': 'https://lh3.googleusercontent.com/YN5Xs5uzgcs4-LoSH0ZiydWmE_3kgRNp2JOHOTXDF-yVFSg93wXJjDqmaXIdTk81qUu0Q8g1zfn9sv6HKHcJQ10L0TeozRml8ZTxyjrsazp_mxoLbeAM957E5AxFlf9ri82zvcTgGfDFT-6UA6ula-p9jNu9QVudyna7gi_OQ3eeFSl3Sq_AyVbQvuaViY1yRQpapZvwNw6568d_SIxRj3JarX7OagSUMFMq4qEZtFA_JlAkY3FGPEg8rbH06EPt4dGFgAxXbpy6r-yL4M_IccYu9i4I2A7U_qvwCDjb5pcY03WGogAPjU0D0hFxWsA5ohGiQuR2rH1Gjo3MIXXmramFWvTGYwPPkAPgpIk6qb2QlrH_p5-EJOrBqQ04UahqOw0tM_i2KcEXWo7oGbUNZqzj4OWGoUyTVGNHJK5fUEAbaTGs6RH_O8hCyf6lma-VkbXEKzrKy4HZhMuUb11Mbe7gNLzmj975FX2Rxv4damVH-IMyU1dzRUIPnOWnFmwskkGWGSfDHZmAA6StAZzlaDuV6KPBSRk0KQ3dD5_72fhPEMMPb3KzsSoM1a4cPg6maMjXuaj_4p1xnfGa5vh1esJpYqimOwXEpOE2ASWbdVjXehKwUuikV2BklcsPrW03dawf9bu5Mesd2nQ0vUQJx9AK8o0_WnZp3TUeuH5EKASaxA23AucgWIjPIg=w892-h1188-no'},
        {'type': 'paragraph', 'data': '\nStarted out our day hiking in the woods. We saw a small black bear and a mama bear. '},
    ]

    let block4 = [
        {'type': 'timestamp', 'data': '10:30'},
        {'type': 'caption', 'data': 'Chasing Sunsets in Wenatche, WA'},
        {'type': 'imagePrompt', 'data': 'Who were you with in Wenatche?'},
        {'type': 'image', 'data': 'https://lh3.googleusercontent.com/dFRtuCDpKCYnfWXE-Pbt_6mI3imqEP2v-m4BfBYkx8xqKNf0qzu5TAtGVJDTjF6cel10-rCZLGnkVsPtXEultAniQdkxVFIz37pJOh6yKyPfLvz8BtFKYayABW2fdCDPsOFEtMsULDKVrYYIV6Z0NpeXIDLcIaydh1TL3l1hnkJ_v9Di_ED-ErlqC7SNUBxj_HsnZeP-6MgXlDmksBuR0Nv2kMeKmt2Jk_LFJfKv_FgC6_2oEgfUzQoKDkzAONkcpdXQHbXsbfbGMfZ5Yn6uzu9WiC82k5XNbe3XRcaEbMTsoMpR42a65arIn4TQI2sh7-e1CtMX5Q5QpDA-t_l5bN-T8L40XZgGF1cSTj_04vQD15X96y6OVv9uFdLbchUW7sPFJY_OJJgv_RudCFktj_YkA67MrEOeCcouKg64hxVoBV3O4OAbK4yi6T6Yt-7g4vUz7l89CcWo6S7DkS1AEUsdxnE1h-y5u2hhOnLceYDJWbl3Z9FXkI2ERQiVb8rf0NaedsG1jebjYOZ23kgbqe3FZzO0O0hshAlOOBcY9U6c3SqzokV6QBczjKnlyycHoenvscZ_Qspl9pj0dlma5shCyzoVGWLw5D_OWEHg7hWBvO5klMPVWmepcdvmpOfRFU4fM1qPe6GcEGYo_OAM5e8EZRM6zsWLTI2oXd9NKVor3-YqcR5SyxBP=w1840-h1036-no'},
        {'type': 'paragraph', 'data': '\nI\'m so sad that this is our last day on the West Coast! I had so much fun this past week camping, fishing, and chasing sunsets. I\'m really going to miss these summer vibes. Fishing, fishing, fishing! '},
    ]

    console.log('received get req!!')

    app.locals.prompts = {
        'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
    }
    app.locals.storedDays[0] = [createBlockFrom(block0), createFitbitBlock()]
    app.locals.storedDays[1] = [createBlockFrom(block1), createFitbitBlock()]
    app.locals.storedDays[2] = [createBlockFrom(block2), createFitbitBlock()]
    app.locals.storedDays[3] = [createBlockFrom(block3), createFitbitBlock()]
    app.locals.storedDays[4] = [createBlockFrom(block4), createFitbitBlock()]
    app.locals.storedDays[5] = [createRockClimbingBlock(), createFitbitBlock()]
    res.send({'Express': app.locals.storedDays})
});

// routes for phone
app.get('/mobile/images/:id', (req, res) => {
    // extract location & timestamp
    // send to im2txt
    // send to google cloud vision
    console.log('received req')
    const current_dict = JSON.stringify(app.locals.keyword_dict);
    // console.log(current_dict)
    const url = 'https://storage.googleapis.com/project-tao/kastanByLake.jpg'
    //  console.log(url)
    const pythonProcess = spawn('python2', ["gcloud/im2Prompt.py", url, current_dict]);
    pythonProcess.stdout.on('data', (data) => {
        var parsed = JSON.parse(data.toString())
        console.log(parsed)
        addImageBlock(parsed)
        res.send({
            'generated_block': data.toString()
        })
        console.log('added new image block!')
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
    // if (req.params.id == 'reset') {
    //     console.log('resetting prompts!!')
    //     app.locals.prompts = {
    //         'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
    //     }
    // }
    let prompts = app.locals.prompts[day]
    console.log(app.locals.keyword_dict)
    console.log('sending prompts back', prompts)
    res.send({ prompts: prompts});
})

app.post('/client/sentiments/:id', (req, res) => {
    // user sends text, send back list of prompts
    const paragraph = req.body.paragraph
    console.log('Analyzing Sentiments ', paragraph)
    const pythonProcess = spawn('python', ["sentiment_analysis.py", paragraph]);
    pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        // var textChunk = data.toString('utf8');

        console.log(data.toString())
        const sentiments = JSON.parse(data.toString())
        res.send({ sentiments: sentiments });
    });
    let day = 'test'
    let prompts = app.locals.prompts[day]
    // console.log('sending prompts back', prompts)
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
        console.log(strings)
        let mergedPrompts = newPrompts.concat(strings)
        // console.log(mergedPrompts)
        req.app.locals.prompts[day] = [...new Set(mergedPrompts)]
        // var textChunk = data.toString('utf8');
        res.send({ prompts: app.locals.prompts[day]});
    });
    // console.log('new prompts: ', newPrompts);
})

app.get('/client/blocks/:id', (req, res) => {
    // user sends hello ping, server sends back a block if there is data available
    // we'll use an id to differentiate entries for different days
    // console.log('received block request!')
    if (req.params.id == 'reset') {
        // app.locals.hasNewBlocks = true
        // app.locals.storedBlocks = []
        // app.locals.prompts = {
        //     'test': ['What was your favorite thing about today?', 'What did you accomplish today?', 'What were you grateful for today?']
        // }
    }
    const hasNewBlocks = app.locals.hasNewBlocks
    // app.locals.hasNewBlocks = false

    const dateIndex = req.params.id
    // console.log(hasNewBlocks)
    var blocks = app.locals.storedDays[dateIndex]
    // blocks = blocks.concat([createRockClimbingBlock(), createFitbitBlock()])
    // if (hasNewBlocks) {
    res.send({ blocks: blocks, hasNewBlocks: hasNewBlocks });
    console.log('sent block back')
    // }
})

app.get('/client/dashboard/:id', (req, res) => {
    // user sends hello ping, server sends back a block if there is data available
    // we'll use an id to differentiate entries for different days
    // console.log('received block request!')

    // console.log('dashboard', app.locals.dashboards[req.params.id])
    res.send({ dashboard: app.locals.dashboards[req.params.id]});
    console.log('sent dashboard back')
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
                        "emojis": "🌲",
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


function addImageBlock(imageDict) {
    let timestamp = { 'type': 'timestamp', 'data': imageDict.timestamp }
    let image = { 'type': 'image', 'data': imageDict.image }
    let imagePrompt = { 'type': 'imagePrompt', 'data': imageDict.imagePrompt }
    let caption = { 'type': 'caption', 'data': imageDict.caption.slice(0, 1).toUpperCase() + imageDict.caption.slice(1) }
    let block = [timestamp, caption, image, imagePrompt]
    app.locals.storedBlocks.push(createBlockFrom(block))
}

function createFitbitBlock() {
    
    let timestamp = '2:30 pm ' + app.locals.emojis[Math.floor(Math.random() * app.locals.emojis.length)]
    let caption = 'Afternoon Run'
    
    let block = [
        {'type': 'timestamp', 'data': timestamp},
        {'type': 'caption', 'data': caption},
        {'type': 'fitbit', 'data': ''},
    ]

    return createBlockFrom(block)

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
