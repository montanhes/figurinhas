import React, { Component } from 'react'
import './css/units.css'
import lodash from 'lodash'
import unitsObj from '../units.json'
// eslint-disable-next-line
import firebase, { auth, provider } from '../firebase'
import 'font-awesome/css/font-awesome.min.css'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { Link } from 'react-router-dom'

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
})

class Units extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            unitsListed: [],
            user: null,
            userUnitList: [],
        }
        this.addUnitToMyList = this.addUnitToMyList.bind(this)
    }

    componentWillMount() {
        this.setState({
            unitsListed: lodash.values(unitsObj)
        })
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user })
                firebase.database().ref('ffbexvius/users/'+user.uid+'/units/').on('value', (snapshot)  => {
                    let listUnitsUser = lodash.values(snapshot.val())
                    //this.setState({ userUnitList: listUnitsUser })
                    let tempUserList = listUnitsUser // firebase
                    let tempJsonList = this.state.unitsListed // units.json
                    /* captura os elementos do firebase em tempUserList compara com o tempJsonList e marca quais devem serem exibidos como ativos ou não usando a classe CSS unit-hide */
                    for (let j = 0; j < tempUserList.length; j++) {
                        for (let f = 0; f < tempJsonList.length; f++) {
                            if(tempUserList[j].unit_id === tempJsonList[f].unit_id){
                                tempJsonList[f].own = tempUserList[j].own
                            }
                        }
                    }
                    this.setState({ unitsListed: tempJsonList})
                })
            }
        })
    }

    addUnitToMyList(e, unit_id) {
        e.preventDefault()
        console.log(unit_id)
        let clickedUnit = document.getElementById(unit_id)
        console.log(clickedUnit.dataset.own)
        if (clickedUnit.dataset.own === 'false') {
            console.log('entrei aqui')
            firebase.database().ref('ffbexvius/users/'+this.state.user.uid+'/units/'+unit_id).set({
                own: true,
                unit_id: unit_id
            })
            document.getElementById(unit_id).classList.remove("unit-hide")
        } else {
            firebase.database().ref('ffbexvius/users/'+this.state.user.uid+'/units/'+unit_id).set({
                own: false,
                unit_id: unit_id
            })
            document.getElementById(unit_id).className = "unit-hide"
        }
    }

    renderUnitsList(unitsListed, star) {
        const filteredUnits = unitsListed.filter(unit => unit.rarity_min === star)
        return filteredUnits.map(unit => (
            <div key={unit.unit_id} className='unit'>
                <a href='' onClick={(evt) => this.addUnitToMyList(evt, unit.unit_id)}>
                    <img id={unit.unit_id} src={unit.img} alt={unit.name} className={unit.own ? 'unit-img' : 'unit-img unit-hide'} data-own={unit.own === true ? true : false} />
                </a>
                <div>{unit.name}</div>
            </div>
        )   )
    }

    render() {
        const { classes } = this.props
        return (
            <div className='main'>
                <aside className='sidebar'>
                    {this.state.user ? 
                    <Paper className={classes.root} elevation={4}>
                        <Typography type="headline" component="h6">
                            Share your profile:
                        </Typography>
                        <p>You can share your units collection using the link below.</p>
                        <Typography type="body1" component="p">
                            <Link className='playerLink' to={'player/'+this.state.user.uid}>https://oakz.org/#/player/{this.state.user.uid}</Link>
                        </Typography>
                    </Paper> : '' }
                    <Paper className={classes.root} elevation={4}>
                        <Typography type="headline" component="h6">
                            Find me:
                        </Typography>
                        <p>Please, report me about problems and send me suggestions.</p>
                        <Typography type="body1" component="p">
                            <a href='https://www.reddit.com/user/ramonoak/'><i className="fa fa-reddit" aria-hidden="true"></i>/u/ramonoak/</a>
                        </Typography>
                        <div>
                            <p>If you like this app you can help me buy a beer! =)</p>
                            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                                <input type="hidden" name="cmd" value="_s-xclick" />
                                <input type="hidden" name="hosted_button_id" value="EB4BV3JDW59HW" />
                                <input type="image" src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!" />
                                <img alt="" border="0" src="https://www.paypalobjects.com/pt_BR/i/scr/pixel.gif" width="1" height="1" />
                            </form>
                        </div>
                    </Paper>
                </aside>
                <div className='list'>
                    <h3><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i></h3>
                    <div className='unitList'>
                        {this.renderUnitsList(this.state.unitsListed, 5)}
                    </div>
                    <h3><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i></h3>
                    <div className='unitList'>
                        {this.renderUnitsList(this.state.unitsListed, 4)}
                    </div>
                    <h3><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i></h3>
                    <div className='unitList'>
                        {this.renderUnitsList(this.state.unitsListed, 3)}
                    </div>
                    <h3><i className="fa fa-star" aria-hidden="false"></i><i className="fa fa-star" aria-hidden="false"></i></h3>
                    <div className='unitList'>
                        {this.renderUnitsList(this.state.unitsListed, 2)}
                    </div>
                    <h3><i className="fa fa-star" aria-hidden="false"></i></h3>
                    <div className='unitList'>
                        {this.renderUnitsList(this.state.unitsListed, 1)}
                    </div>
                </div>
            </div>
        )
    }
}

Units.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Units)