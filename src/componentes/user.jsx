import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { Link } from 'react-router-dom'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import firebase, { auth } from '../firebase'
import './css/user.css'

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
})

class User extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            user: null,
            ffbeid: undefined,
        }
        this.saveUserFfbeId = this.saveUserFfbeId.bind(this)
        this.handleUserffbeId = this.handleUserffbeId.bind(this)
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (!user) return;
            this.setState(
                { user },
            )
            firebase.database().ref(`ffbexvius/users/${this.props.userInfo.uid}/info/`).on('value', (snapshot) => {
                this.setState({ ffbeid: snapshot.val().player_id })
            })
        })
    }

    saveUserFfbeId() {
        const user = this.state.user
        const refUrl = `ffbexvius/users/${user.uid}/info/`
        const userFfbeId = document.getElementById('ffbeid').value
        console.log(userFfbeId)
        //firebase save on database
        firebase.database().ref(refUrl).set({
            player_id: userFfbeId,
        });
        this.setState({ ffbeid: userFfbeId })
        //disable input
        //change button to edit
        //snackbar
    }

    handleUserffbeId() {
        this.setState({ ffbeid: undefined })
    }

    render() {
        const { classes } = this.props
        return (
            <Paper className={classes.root} elevation={4}>
                <Typography type="headline" component="h6">
                    Share your profile:
                </Typography>
                <p>Share your units collection using the link below.</p>
                <Typography type="body1" component="p">
                    <Link className='playerLink' to={'player/'+this.props.userInfo.uid}>https://oakz.org/#/player/{this.props.userInfo.uid}</Link>
                </Typography>
                <form className={classes.container} noValidate autoComplete="off">
                    <p>Share your FFBE ID:</p>
                    {this.state.ffbeid === undefined ? 
                    <TextField id="ffbeid" label="FFBE ID" className={classes.textField} margin="normal" /> : 
                    <Typography type="headline" component="h5">
                    {this.state.ffbeid}
                    </Typography>}
                    {this.state.ffbeid === undefined ? 
                    <Button id='saveBtn' raised color="primary" className={classes.button} onClick={this.saveUserFfbeId}>
                        Save
                    </Button> :
                    <Button id='saveBtn' raised color="primary" className={classes.button} onClick={this.handleUserffbeId}>
                        Edit
                    </Button>}
                </form>
            </Paper>
        )
    }
}

User.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(User)