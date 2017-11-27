import React, { Component } from 'react';
import './css/units.css'
import lodash from 'lodash'
import unitsObj from '../units.json'
// eslint-disable-next-line
import firebase, { auth, provider } from '../firebase'

class Units extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            unitsListed: [],
            user: null
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
                //console.log(this.state.user)
            }
        })
    }

    addUnitToMyList(e, unit_name, unit_id) {
        e.preventDefault()
        console.log(unit_name + ' ' + unit_id)
    }

    renderUnitsList(unitsListed) {
        /*
        unitsListed.forEach(function() {
            if(element['rarity_max'] == 6 || element['rarity_max'] == 5 || element['rarity_max'] == 4) {
                element.splice()
            }
        });
        */

        return unitsListed.map(unit => (
            <div key={unit.unit_id} className='unit'>
                <a href='' id={unit.unit_id} onClick={(evt) => this.addUnitToMyList(evt, unit.name, unit.unit_id)}>
                    <img src={unit.img} alt={unit.name} className='unit-img unit-hide' />
                </a>
                <div>{unit.name}</div>
            </div>
        )   )
    }

    render() {
        return (
            <div className='unitList'>
                {this.renderUnitsList(this.state.unitsListed)}
            </div>
        )
    }
}

export default Units