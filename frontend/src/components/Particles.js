import Particles from 'react-particles-js';
import React, { Component } from 'react';

class BubblesParticle extends Component {
    render() {
        return (
            <Particles
            className='particles'
            params={{
                "particles": {
                    "number": {
                        "value": 75,
                        "density": {
                            "enable": false
                        }
                    },
                    "color": {
                        value: this.props.color,
                    },
                    "size": {
                        "value": 10,
                        "random": true,
                        "anim": {
                            "speed": 4,
                            "size_min": 0.3
                        }
                    },
                    "line_linked": {
                        "enable": false
                    },
                    "move": {
                        "random": true,
                        "speed": 1,
                        "direction": "top",
                        "out_mode": "out"
                    }
                },
                "interactivity": {
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "bubble"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "repulse"
                        }
                    },
                    "modes": {
                        "bubble": {
                            "distance": 250,
                            "duration": 2,
                            "size": 0,
                            "opacity": 0
                        },
                        "repulse": {
                            "distance": 400,
                            "duration": 4
                        }
                    }
                }
            }} />
        );
    }
}

export default BubblesParticle