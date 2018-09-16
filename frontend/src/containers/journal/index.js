import React, { Component } from 'react';
import { Header, Divider, Loader, Button, Grid, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import Block from '../../components/Block'
import Dashboard from '../../components/Dashboard'

const mapDispatchToProps = dispatch => bindActionCreators({
    menuClicked: (to) => {
        return push('/' + to)
    }
}, dispatch)

function mapJSONToBlock(block, index) {
    // const hasLink = true
    return (
        <Block valueJSON={block} />
    );
}

class Journal extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    };
    
    componentDidMount() {
        var handle = setInterval(this.awaitBlocks, 1000);
        var handle2 = setInterval(this.awaitPrompts, 1000);
        this.setState({
            handle: handle
        })
    }

    awaitBlocks = () => {
        this.callApi()
            .then(res => {
                const blocks = res.blocks
                console.log(blocks)
                this.setState ({
                    testBlocks: blocks
                })
            })
            .catch(err => console.log(err));
    }

    awaitPrompts = () => {
        this.addPrompt()
            .then(res => {
                const prompts = res.prompts
                console.log(prompts)
                this.setState({
                    prompts: prompts
                })
            })
            .catch(err => console.log(err));
    }



    callApi = async () => {
        const server_url = 'https://lotus-journal.herokuapp.com/blocks/test';
        const response = await fetch('/client/blocks/test');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    addPrompt = async () => {
        const server_url = 'https://lotus-journal.herokuapp.com/blocks/test';
        const response = await fetch('/client/text/test');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        const blocks = this.state.testBlocks
        const journalEntry = blocks ? blocks.map(mapJSONToBlock): <Loader className='block-loading' active={true}><Header>Loading your journal...</Header></Loader>
        const prompts = this.state.prompts? this.state.prompts.map((item, index) => item) : ''
        return (
            <div className="App-intro">
                <Segment className='day-segment'>
                    {/* replace with headline/emoji generated & returned by backend */}
                    <Header size='huge' content='☕🌧️☔📚🏃‍' />
                    {/* replace with date variable */}
                    <div>
                        <Grid centered columns='three'>
                            <Button basic circular style={{ marginTop: '1.5%', width: '40px', height: '40px' }} icon='chevron left' floated='left' id='left' />
                            <Header size='large' style={{ paddingBottom: '3%' }} content='Sunday, September 9' />
                            <Button basic circular style={{ marginTop: '1.5%', width: '40px', height: '40px' }} icon='chevron right' floated='right' id='right' />
                        </Grid>
                    </div>
                    <Dashboard />
                    {/* <ul>
                        <li><Block /></li>
                        <li><Block /></li>
                    </ul> */}
                    {journalEntry}
                </Segment>
                <Segment className='suggestions-box'>
                    <Header>Prompts</Header>
                    <Divider />
                    {prompts}
                </Segment>
            </div>
        );
    }
}



export default connect(
    null,
    mapDispatchToProps
)(Journal)
