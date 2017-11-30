import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { Link } from 'react-router-dom'

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
        }
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
            </Paper>
        )
    }
}

User.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(User)