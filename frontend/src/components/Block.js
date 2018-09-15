import React, {Component} from 'react';
import { Button, Segment, Image, Card, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import { Editor } from 'slate-react'

import { Value } from 'slate'

var colors = ['#5f49cf', '#66cc91', '#139e80', '#50a6b1', '#f293d7', '#c56aab']

const mapDispatchToProps = dispatch => bindActionCreators({
    menuClicked: (to) => {
        return push('/' + to)
    }
}, dispatch)

class Block extends Component {
    constructor(props) {
        super(props)
        const valueJSON = props.valueJSON
        this.state = {
            value: Value.fromJSON(valueJSON),
            hasImage: false,
        }
    }

    schema = {
        inlines: {
            emoji: {
                isVoid: true,
            },
            fitbit: {
                isVoid: true,
            },
            location: {
                isVoid: true,
            },
            image: {
                isVoid: true,
            },
            imageEmoji: {
                isVoid: true,
            },
            imagePrompt: {
                isVoid: true,
            },
            timestamp: {
                isVoid: true,
            },
            weather: {
                isVoid: true,
            }
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
            case 'heading-two':
                return <h3 {...attributes}> {children} </h3>
            case 'image':
                const src = node.data.get('src')
                const emojis = node.data.get('emojis')
                const mood = node.data.get('mood')
                this.setState({ hasImage: true })
                return (
                    <Card className='imageCard'><Image className='image' size='medium'  {...attributes} src={src} />
                        <Card.Content extra>
                            {'Tags: ' + emojis + ' Mood: ' + mood}
                        </Card.Content>
                    </Card>
                );
            case 'fitbit':
                return (
                    <Card className='fitbitCard' centered><Image className='image' size='medium'  {...attributes} src={src} />
                        <Card.Content textAlign='center' className='Entry-Card-Content'>
                            <Card.Header></Card.Header>
                            <Card.Meta></Card.Meta>
                            <Divider />
                            <Image size='mini' src={fitbit_logo} />
                        </Card.Content>
                        <Card.Content extra>
                            {'Tags: ' + emojis + ' Mood: ' + mood}
                        </Card.Content>
                    </Card>
                );
            case 'location':
                return (
                    <Card className='fitbitCard' centered><Image className='image' size='medium'  {...attributes} src={src} />
                        <Card.Content textAlign='center' className='Entry-Card-Content'>
                            <Card.Header></Card.Header>
                            <Card.Meta></Card.Meta>
                            <Divider />
                            <Image src={hobbs} />
                        </Card.Content>
                        <Card.Content extra>
                            {'Tags: ' + emojis + ' Mood: ' + mood}
                        </Card.Content>
                    </Card>
                );
            case 'imagePrompt':
                return <p className='imagePrompt' {...attributes}> {children} </p>
            // case 'weather':
            //     const weather = node.data.get('weather')
            //     return <Image className='weather' src={getWeatherIcon(weather)}/>
            case 'timestamp':
                return <h3 className='timestamp'{...attributes}> {children} </h3>
            case 'caption':
                return <p className='caption' {...attributes}> {children} </p>
            case 'button':
                console.log('printing node:')
                const color = colors[Math.floor(Math.random() * colors.length)];
                colors.splice(colors.indexOf(color), 1)
                return <Button content={node.text} size='huge' style={{ backgroundColor: color, color: '#FFF' }} />
        }
    }

    // On change, update the app's React state with the new editor value.
    onChange = ({ value }) => {
        this.setState({ value })
    }

    onKeyDown = (e, change) => {
        if (!e.ctrlKey) { return }
        e.preventDefault()

        switch (e.key) {
            case 'b': {
                change.addMark('bold')
                return true
            }
        }
    }

    componentDidMount() {
        var { value } = this.state
        this.setState({ value })
    }

    render() {
        const editorBottom = this.state.hasImage ? '45%' : '10%'
        return (
            <div className="App-intro">
                <Segment basic style={{ border: 'none', paddingTop: '0px', paddingBottom: '0px', width: '80%', marginTop: '0%', marginLeft: '10%', marginRight: '10%' }}>
                    <Button basic circular style={{ marginTop: '5%' }} icon='ellipsis horizontal' floated='right' />
                    <Editor
                        className="journal-editor"
                        value={this.state.value}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        renderNode={this.renderNode}
                        plugins={plugins}
                        schema={this.schema}
                        style={{ paddingBottom: editorBottom }}
                    />
                </Segment>
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Block)
