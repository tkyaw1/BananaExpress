import React, {Component} from 'react';
import { Button, Segment, Image, Card, Header, Divider } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash';

import fitbit_logo from '../assets/fitbit_logo.png'

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
            userSentences: [],
            newSentenceAvailable: false
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
                            <Image />
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

    getJournalText = (nodes) => {
        var sentences = []
        nodes.forEach((node) => {
            // if (node.type === 'paragraph') {
            //     var test = _.flatMapDeep(node.nodes)
            //     // console.log(test)
            //     // node.nodes.map((text) => {
            //     //     let leaves = text.leaves
            //     //     leaves.map((leaf) => {
            //     //         console.log(leaf.text)
            //     //     })
            //     // })
            // }
            sentences.push(node.text)
        })
        return sentences
    }

    // On change, update the app's React state with the new editor value.
    onChange = ({ value }) => {
        // console.log(value.document.nodes.forEach)
        const paragraph = value.document.text
        console.log(paragraph.length)
        if (paragraph.length > 200) {
            console.log('sending paragraph')
            this.props.sendParagraph(paragraph)
        }
        this.setState({ value })
    }

    onKeyDown = (e, change) => {
        if (!e.ctrlKey) { 
            this.props.isTyping()
            if (e.key === '.' || e.key === '!' || e.key === '?') {
                let sentences = this.getJournalText(this.state.value.document.nodes)
                let mostRecentSentence = sentences[sentences.length - 1] + e.key
                this.setState({ userSentences: sentences })
                this.props.sentenceReady(mostRecentSentence)
            }
            return
        }
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
            <div className="block">
                <Segment basic style={{ border: 'none', paddingTop: '0px', paddingBottom: '0px', width: '80%', marginTop: '0%', marginLeft: '10%', marginRight: '10%' }}>
                    <Button basic circular style={{ marginTop: '5%' }} icon='ellipsis horizontal' floated='right' />
                    <Editor
                        className="journal-editor"
                        value={this.state.value}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        renderNode={this.renderNode}
                        schema={this.schema}
                        style={{ paddingBottom: editorBottom }}
                    />
                    {this.state.userSentences.map((sentence) => {sentence})}
                </Segment>
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Block)
