import React, { Component } from 'react'
// eslint-disable-next-line
import firebase, { auth, provider } from './firebase'
import Header from './componentes/header'
import Units from './componentes/units'
import Footer from './componentes/footer'
import 'typeface-roboto'
import { Switch, Route, HashRouter } from 'react-router-dom' 
import Player from './componentes/player'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
        }
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user })
            }
        })
    }

    login() {
        auth.signInWithPopup(provider) 
            .then(({ user }) => {
                this.setState({ user })
            })
    }

    logout() {
        auth.signOut()
            .then(() => {
                this.setState({ user: null })
            })
    }

    render() {
        return ( 
            <div className='app-content'>
                <Header user={this.state.user} login={this.login} logout={this.logout} />
                <HashRouter basename='/'>
                    <Switch>
                        <Route exact path='/' component={Units} user={this.state.user} />
                        <Route path='/player/:pid' component={Player} />
                    </Switch>
                </HashRouter>
                <Footer />
            </div>
        )
    }
}

export default App