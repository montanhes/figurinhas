import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
})

class PlayerInfo extends Component {

    render() {
        const { classes } = this.props
        return (
            <Paper className={classes.root} elevation={4}>
                <Typography type="headline" component="h1">
                    My FFBE ID:
                </Typography>
                <Typography type="headline" component="h5">
                    {this.props.ffbeid}
                </Typography>
            </Paper>
        )
    }
}

PlayerInfo.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(PlayerInfo)