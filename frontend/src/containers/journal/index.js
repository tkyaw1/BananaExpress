import React, { Component } from 'react';
import { Header, Divider, Loader, Button, Grid, Segment, Card} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import Block from '../../components/Block'
import Dashboard from '../../components/Dashboard'

import BubbleParticles from '../../components/Particles';

import left_wing from '../../assets/logo_left_half.svg'
import right_wing from '../../assets/logo_right_half.svg'

import { XYPlot, VerticalBarSeries, HorizontalBarSeries, XAxis, YAxis } from 'react-vis';

var cardColors = ['orange', 'yellow', 'olive', 'teal', 'blue', 'violet', 'purple', 'pink', 'grey']

const mapDispatchToProps = dispatch => bindActionCreators({
    menuClicked: (to) => {
        return push('/' + to)
    }
}, dispatch)

function generateColor() {
    if (cardColors.length == 0) {
        cardColors = ['orange', 'yellow', 'olive', 'teal', 'blue', 'violet', 'purple', 'pink', 'grey']
    }
    const color = cardColors[Math.floor(Math.random() * cardColors.length)];
    cardColors.splice(cardColors.indexOf(color), 1)
    return color
}

function mapPromptsToCards(prompt, index) {
    // const hasLink = true
    
    return (
        <Card className='promptCard' style={{animationDelay: '' + index/(index+1) + 's'}} color='teal' fluid header={prompt}></Card>
    );
}

class Journal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            hasNewSentence: true,
            prompts: [],
            date: '9-16-2018',
            dashboard: {
                temperature: 0,
                steps: 0,
                sleep: '0 hr 0 min',
                weather: 'lightning',
                mood: 'grinSweat'
            },
            isTyping: false,
        }
    };
    
    componentDidMount() {
        var handle = setInterval(this.awaitBlocks, 1000);
        var handle2 = setInterval(this.awaitPrompts, 1000);
        var handle3 = setInterval(this.setupDashboard, 5000);
        this.setState({
            handle: handle,
            handle2: handle2,
            handle3: handle3,
            initialFetch: true
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.handle)
        clearInterval(this.state.handle2)
        clearInterval(this.state.handle3)
    }

    setupDashboard = () => {
        this.fetchDashboardData()
            .then(res => {
                console.log('received dashbboard response')
                console.log(res.dashboard)
                this.setState({
                    dashboard: res.dashboard
                })
            })
            .catch(err => console.log(err));
    }

    fetchDashboardData = async () => {
        // const url = 'https://lotus-journal.herokuapp.com/blocks/test';
        var url = '/client/dashboard/' + this.state.date
        // if (this.state.initialFetch) {
        //     url = '/client/blocks/reset'
        // }

        const response = await fetch(url);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    awaitBlocks = () => {
        this.callApi()
            .then(res => {
                const { blocks, hasNewBlocks } = res
                console.log('received block response')
                if (hasNewBlocks) {
                    this.setState ({
                        blocks: blocks
                    })
                }
            })
            .catch(err => console.log(err));
    }

    awaitPrompts = () => {
        this.fetchPrompts()
            .then(res => {
                console.log('received response!')
                const newPrompts = res.prompts
                console.log(newPrompts)
                this.setState({
                    prompts: newPrompts
                })
            })
            .catch(err => console.log(err));
    }

    fetchPrompts = async () => {
        // const url = 'https://lotus-journal.herokuapp.com/blocks/test';
        var url = '/client/prompts/test'
        // if (this.state.initialFetch) {
        //     url = '/client/blocks/reset'
        // }
        console.log('sent prompt fetch!')

        const response = await fetch(url);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    awaitSentiments = (paragraph) => {
        this.fetchSentiments(paragraph)
            .then(res => {
                console.log('received response!')
                const sentiments = res.sentiments
                const parsedSentiments = Object.entries(sentiments);
                const sentimentsArray = parsedSentiments.map(sentiment => {
                    return {x: sentiment[1]*100, y: sentiment[0].substring(0, 3)}
                })
                console.log(sentimentsArray)
                this.setState({
                    sentiments: sentimentsArray
                })
            })
            .catch(err => console.log(err));
    }

    fetchSentiments = async (paragraph) => {
        var url = '/client/sentiments/test'
        const request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paragraph: paragraph
            })
        }
        const response = await fetch(url, request);
        console.log('sent sentiment fetch!')
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    mapJSONToBlock = (block, index) => {
        if (this.state.blocks && this.state.blocks.length == index + 1) {
            return <Block isTyping={this.handleUserTyping} sentenceReady={this.handleSentence} valueJSON={block} />
        }
        return (
            <li key={index}><Block isTyping={this.handleUserTyping} sendParagraph={this.awaitSentiments} sentenceReady={this.handleSentence} valueJSON={block} /></li>
        );
    }

    handleUserTyping = () => {
        this.setState({
            isTyping: true
        })
    }

    callApi = async () => {
        // const server_url = 'https://lotus-journal.herokuapp.com/blocks/test';
        var url = '/client/blocks/test'
        if (this.state.initialFetch) {
            url = '/client/blocks/reset'
            this.setState({
                initialFetch: false
            })
        }
        const response = await fetch(url);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleSentence = (sentence) => {
        this.sendNewSentence(sentence)
            .then(res => {
                console.log('received response!')
                const newPrompts = res.prompts
                console.log(newPrompts)
                this.setState({
                    prompts: newPrompts
                })
            })
            .catch(err => console.log(err));
    }

    sendNewSentence = async (sentence) => {
        // this.setState({
        //     hasNewSentence: false,
        // })
        console.log(sentence)
        const request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newSentence: sentence
            })
        }
        const response = await fetch('/client/text/test', request);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };



    render() {
        
        const isTyping = this.state.isTyping
        const blocks = this.state.blocks
        const journalEntry = blocks ? blocks.map(this.mapJSONToBlock): <Loader className='block-loading' active={true}><Header>Loading your journal...</Header></Loader>
        const prompts = this.state.prompts? this.state.prompts.map(mapPromptsToCards) : ''
        const dashboard = this.state.dashboard
        const sentimentGraph = this.state.sentiments ? <XYPlot className='sentimentGraph' style={{ strokeWidth: 2 }} xType="linear" yType={'ordinal'} height={300} width={300}>
            <XAxis title="Sentiments" position="start"/>
            <YAxis title="Score" position="end"/>
            <HorizontalBarSeries style={{ strokeWidth: 0.5 }} data={this.state.sentiments} />
        </XYPlot>: null
        return (
            <div className="App-intro">
                <Segment className='day-segment'>
                    {/* replace with headline/emoji generated & returned by backend */}
                    <Header size='huge' content='☕🌧️☔📚🏃‍' />
                    {/* replace with date variable */}
                    <div>
                        <Grid centered columns='three'>
                            <Button basic circular style={{ marginTop: '1.5%', width: '40px', height: '40px' }} icon='chevron left' floated='left' id='left' />
                            <Header size='large' style={{ paddingBottom: '3%' }} content='Saturday, September 16' />
                            <Button basic circular style={{ marginTop: '1.5%', width: '40px', height: '40px' }} icon='chevron right' floated='right' id='right' />
                        </Grid>
                    </div>
                    <Dashboard {...dashboard}/>
                    <ul>{journalEntry}</ul>
                </Segment>
                <Segment hidden={!isTyping} className='suggestions-box'>
                    <div className="ui center image butterfly_container">
                        <var className="rotate3d">
                            <figure className="butterfly">
                                <img className="wing left" src={left_wing} />
                                <img className="wing right" src={right_wing} />
                            </figure>
                        </var>
                    </div>
                    <Header>Prompts</Header>
                    <Divider />
                    {prompts}
                    {sentimentGraph}
                </Segment>
            </div>
        );
    }
}



export default connect(
    null,
    mapDispatchToProps
)(Journal)
