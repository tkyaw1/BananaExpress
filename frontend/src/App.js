import React, { Component } from 'react';
import HeaderBanner from './components/HeaderBanner'
import Routes from './routes'
import './App.css';

import { connect } from 'react-redux'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {history} = this.props
        const path = history.location.pathname
        return (
            <main className='App'>
                <HeaderBanner path={path}/>
                <Routes history={history}/>
            </main>
        );
    }
}

export default App
