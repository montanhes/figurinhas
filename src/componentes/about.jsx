import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import 'font-awesome/css/font-awesome.min.css'

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
})

class About extends Component {
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
                    Find me:
                </Typography>
                <p>Please, report me about problems and send suggestions.</p>
                <Typography type="body1" component="p">
                    <a href='https://www.reddit.com/user/ramonoak/'><i className="fa fa-reddit" aria-hidden="true"></i>/u/ramonoak/</a>
                </Typography>
                <div>
                    <p>If you like this app buy me a beer! =)</p>
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_s-xclick" />
                        <input type="hidden" name="hosted_button_id" value="EB4BV3JDW59HW" />
                        <input type="image" src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!" />
                        <img alt="" border="0" src="https://www.paypalobjects.com/pt_BR/i/scr/pixel.gif" width="1" height="1" />
                    </form>
                </div>
            </Paper>
        )
    }
}

About.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(About)