import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import left_wing from '../../assets/logo_left_half.svg'
import right_wing from '../../assets/logo_right_half.svg'
import logo from '../../assets/logo.svg'
import { Image, Button } from 'semantic-ui-react'

import { Editor } from 'slate-react'

import { Value } from 'slate'

// Create our initial value...
const initialValue = (text) => Value.fromJSON({
    document: {
        nodes: [{
            object: 'block',
            type: 'heading',
            nodes: [{
                object: 'text',
                leaves: [{
                    text: text,
                },],
            },],
        },],
    },
    selection: {
        object: 'selection',
        anchor: { object: 'point', offset: text.length, path: [0, 0] },
        focus: {
            object: 'point',
            offset: text.length,
            path: [0, 0]
        },
        isFocused: true,
    },
    decorations: {
        mark: {}
    }
})

const initialString = 'Welcome to Lotus, \nYour personal timeline journal with superpowers.'

const mapDispatchToProps = dispatch => bindActionCreators({
    menuClicked: (to) => {
        return push('/' + to)
    }
}, dispatch)

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: initialValue(initialString.substring(0, 1)),
            initialValueIndex: 1,
        }
    }

    animateInitialText = () => {
        this.setState({
            value: initialValue(initialString.substring(0, this.state.initialValueIndex + 1)),
            initialValueIndex: this.state.initialValueIndex + 1
        })
        if (this.state.initialValueIndex === initialString.length) {
            clearInterval(this.state.handle)
        }
    }

    renderNode = props => {
        const {
            attributes,
            children,
            node
        } = props

        switch (node.type) {
            case 'heading':
                return <h1 {...attributes}> {children} </h1>
        }
    }

    handleButtonClick = (e) => {
        this.props.menuClicked('journal')
    }

    // On change, update the app's React state with the new editor value.
    onChange = ({ value }) => {
        this.setState({ value })
        console.log(value.selection.toJSON())
    }

    onKeyown = (e, change) => {
        console.log(e.key)
    }

    componentDidMount() {
        var handle = setInterval(this.animateInitialText, 40);
        this.setState({
            handle: handle
        })
    }

    render() {
        return (
            <div className="App-intro">
                <Editor
                    className="intro-journal"
                    value={this.state.value}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    renderNode={this.renderNode}
                />
                <Button id='button1' size='massive' color='teal' onClick={this.handleButtonClick} content='Get started!' />
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Home)
