import { Segment, Image, Header, Grid } from 'semantic-ui-react'
import React, { Component } from 'react'

import { Editor } from 'slate-react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import steps from '../assets/footsteps.svg'
import bed from '../assets/bed.svg'
import lightning from '../assets/cloud-lightning.svg'

const mapDispatchToProps = dispatch => bindActionCreators({
    menuClicked: (to) => {
        return push('/' + to)
    }
}, dispatch)

var colors = ['#5f49cf', '#66cc91', '#139e80', '#50a6b1', '#f293d7', '#c56aab']

const getWeatherIcon = (string) => {
    switch (string) {
        case 'lightning': return lightning;
    }
}

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            temperature: 70,
            steps: 8000,
            sleep: '7 hr 30 min',
            weather: 'lightning'
        }
    }

    render() {
        // const color = colors[Math.floor(Math.random() * colors.length)];
        return (
            <div className='dashboard'>
                <Segment basic>
                    <Grid columns='three' divided>
                        <Grid.Row>
                            <Grid.Column>
                                <Header textAlign='center' style={{ lineHeight: '2em' }}>
                                    <Image size='tiny' style={{ float: 'left', left: '40%', width: '30px', height: '30px' }} src={steps} />
                                    {this.state.steps}
                                </Header>
                            </Grid.Column>
                            <Grid.Column>
                                <Header textAlign='center' style={{ lineHeight: '2em' }}>
                                    <Image size='tiny' style={{ float: 'left', left: '40%', width: '30px', height: '30px' }} src={getWeatherIcon(this.state.weather)} />
                                    {this.state.temperature + 'º'}
                                </Header>
                            </Grid.Column>
                            <Grid.Column>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header textAlign='center' style={{ lineHeight: '2em' }}>
                                    <Image size='tiny' style={{ float: 'left', left: '40%', width: '30px', height: '30px' }} src={bed} />
                                    <div style={{ marginLeft: '5em' }}>{this.state.sleep}</div>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Dashboard)