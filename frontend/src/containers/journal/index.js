import React, { Component } from 'react';
import { Loader, Header, Image, Divider, Button, Card, Segment} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = dispatch => bindActionCreators({
    menuClicked: (to) => {
        return push('/' + to)
    }
}, dispatch)

class Journal extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    };

    componentDidMount() {
    }

    render() {
        return (
            <div className="App-intro">
                
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Journal)
