import React, { Component } from 'react'
import lodash from 'lodash'
import unitsObj from '../units.json'
// eslint-disable-next-line
import firebase, { auth, provider } from '../firebase'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import SwipeableViews from 'react-swipeable-views'
import Tabs, { Tab } from 'material-ui/Tabs'
import StarIcon from 'material-ui-icons/Star'
import './css/units.css'
import 'font-awesome/css/font-awesome.min.css'

function TabContainer({ children, dir }) {
    return (
        <div dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </div>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
}

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
})

class Player extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            unitsListed: [],
            user: props.match.params.pid,
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };
    
    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    state = {
        value: 0,
    };

    componentWillMount(props) {
        this.setState({
            unitsListed: Object.values(unitsObj).sort((a, b) => a.name.localeCompare(b.name)),
            value: 0,
        })
    }

    componentDidMount() {
        firebase.database().ref('ffbexvius/users/'+this.state.user+'/units/').on('value', (snapshot)  => { //jogar isso dentro do if acima para não ficar dando erro no console
            let listUnitsUser = lodash.values(snapshot.val())
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

    renderUnitsList(unitsListed, star) {
        const filteredUnits = star > 0
        ? unitsListed.filter(unit => unit.rarity_min === star)
        : unitsListed.filter(unit => unit.own === true);

        return filteredUnits.map(unit => (
            <div key={unit.unit_id} className='unit'>
                <a>
                    <img id={unit.unit_id} src={unit.img} alt={unit.name} className={unit.own ? 'unit-img' : 'unit-img unit-hide' } />
                </a>
                <div><a href={'https://exvius.gamepedia.com/'+unit.name.replace(/\s/g, "_")}>{unit.name}</a></div>
            </div>
        )   )
    }

    render() {
        const { theme } = this.props
        return (
            <div className='list'>
                <AppBar position="static" color="default">
                    <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="primary" fullWidth>
                        <Tab icon={<div><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>} />
                        <Tab icon={<div><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>} />
                        <Tab icon={<div><StarIcon /><StarIcon /><StarIcon /></div>} />
                        <Tab icon={<div><StarIcon /><StarIcon /></div>} />
                        <Tab icon={<StarIcon />} />
                        <Tab icon={<div>All</div>} />
                    </Tabs>
                </AppBar>
                <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={this.state.value} onChangeIndex={this.handleChangeIndex}>
                    <TabContainer dir={theme.direction}>
                        <div className='unitList'>
                            {this.renderUnitsList(this.state.unitsListed, 5)}
                        </div>
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <div className='unitList'>
                            {this.renderUnitsList(this.state.unitsListed, 4)}
                        </div>
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <div className='unitList'>
                            {this.renderUnitsList(this.state.unitsListed, 3)}
                        </div>
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <div className='unitList'>
                            {this.renderUnitsList(this.state.unitsListed, 2)}
                        </div>
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <div className='unitList'>
                            {this.renderUnitsList(this.state.unitsListed, 1)}
                        </div>
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <div className='unitList'>
                            {this.renderUnitsList(this.state.unitsListed, 0)}
                        </div>
                    </TabContainer>
                </SwipeableViews>
            </div>
        )
    }
}

Player.propTypes = {
    theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(Player)