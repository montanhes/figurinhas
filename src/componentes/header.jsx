import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
// eslint-disable-next-line
import firebase, { auth, provider } from '../firebase'
import Units from '../componentes/units'
import Footer from '../componentes/footer'
import './css/header.css'

const styles = theme => ({
    root: { width: '100%', },
    flex: { flex: 1, },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
})

class MenuAppBar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user: null
        }
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
    }

    login() {
        auth.signInWithPopup(provider) 
            .then((result) => {
                const user = result.user
                //console.log(user)
                this.setState({
                    user
                })
        })
    }

    logout() {
        auth.signOut()
        .then(() => {
            this.setState({
                user: null
            });
        });
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user })
            }
        })
    }

    handleChange = (e) => {
    };

    render() {
        const { classes } = this.props
        return (
            <div>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography type="title" color="inherit" className={classes.flex}>FFBE Unit Collection</Typography>
                                <div className='login-box'>
                                    {this.state.user ? <div className='img-box'><img className='user-img' src={this.state.user.photoURL} alt={this.state.user.displayName}/></div> : <div></div> }
                                    {this.state.user ?
                                        <Button color="contrast" onClick={this.logout}>Logout</Button>
                                        :
                                        <Button color="contrast" onClick={this.login}>Login</Button>
                                    }
                                </div>
                        </Toolbar>
                    </AppBar>
                </div>
                <Units />
                <Footer />
            </div>
        )
    }
}

MenuAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MenuAppBar)