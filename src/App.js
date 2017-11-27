import React, { Component } from 'react'
import 'typeface-roboto'
import Header from './componentes/header'


class App extends Component {

    constructor(props) {
        super(props)
        this.state = { user: null }
    }

    render() {
        return ( 
            <Header />
        );
    }
}

export default App;