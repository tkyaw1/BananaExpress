import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import { NavHashLink as NavLink } from 'react-router-hash-link';

import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { XYPlot, LineSeries } from 'react-vis';

const mapDispatchToProps = dispatch => bindActionCreators({
    menuClicked: (to) => {
        return push('/' + to)
    }
}, dispatch)

class Insights extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    render() {
        return (
            <div className="App-intro">
                <Segment className='day-segment'>

                </Segment> 
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Insights)
