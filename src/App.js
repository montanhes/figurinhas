import React, { Component } from 'react'
import firebase, { auth, provider } from './firebase'
import Header from './componentes/header'
import Units from './componentes/units'
import Footer from './componentes/footer'
import 'typeface-roboto'

class App extends Component {

    constructor(props) {
        super(props)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)

        this.state = {
            user: null,
        }
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
                this.setState({ user });
            })
    }
    
    logout() {
        auth.signOut()
            .then(() => {
                this.setState({ user: null });
            })
    }

    render() {
        return ( 
            <div>
                <Header user={this.state.user} login={this.login} logout={this.logout} />
                <Units user={this.state.user} />
                <Footer />
            </div>
        )
    }
}

export default App