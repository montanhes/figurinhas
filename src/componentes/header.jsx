import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
// eslint-disable-next-line
import './css/header.css'

const styles = theme => ({
    root: { width: '100%', },
    flex: { flex: 1, },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
})

class MenuAppBar extends PureComponent {

    constructor(props) {
        super(props)
        this.copyLink = this.copyLink.bind(this)
    }

    copyLink(){
        let copyText = document.getElementById('shareLink');
        copyText.select();
        document.execCommand('copy');
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography type="title" color="inherit" className={classes.flex}>FFBE Unit Collection</Typography>
                            <div className='login-box'>
                                {this.props.user ? 
                                    <div className='shareLink'>
                                        <div id='shareLink'>https://oakz.org/ffbecollection/player/{this.props.user.uid}</div>
                                        <Button color="contrast" onClick={this.copyLink}>Copy</Button>
                                    </div>
                                    : <div></div> }
                                {this.props.user ? <div className='img-box'><img className='user-img' src={this.props.user.photoURL} alt={this.props.user.displayName}/></div> : <div></div> }
                                {this.props.user ?
                                    <Button color="contrast" onClick={this.props.logout}>Logout</Button>
                                    :
                                    <Button color="contrast" onClick={this.props.login}>Login</Button>
                                }
                            </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

MenuAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    user: PropTypes.object

}

MenuAppBar.defaultProps = {
    user: undefined,
}

export default withStyles(styles)(MenuAppBar)