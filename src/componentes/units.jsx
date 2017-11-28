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
            }
            firebase.database().ref('ffbexvius/users/'+user.uid+'/units/').on('value', (snapshot)  => { //jogar isso dentro do if acima para não ficar dando erro no console
                let listUnitsUser = lodash.values(snapshot.val())
                this.setState({ userUnitList: listUnitsUser })
                let tempUserList = this.state.userUnitList // firebase
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
        })
    }

    addUnitToMyList(e, unit_id) {
        e.preventDefault()
        firebase.database().ref('ffbexvius/users/'+this.state.user.uid+'/units/'+unit_id).set({
            own: true,
            unit_id: unit_id
        })
        document.getElementById(unit_id).classList.remove("unit-hide")
    }

    renderUnitsList(unitsListed) {
        return unitsListed.map(unit => (
            <div key={unit.unit_id} className='unit'>
                <a href='' onClick={(evt) => this.addUnitToMyList(evt, unit.unit_id)}>
                    <img id={unit.unit_id} src={unit.img} alt={unit.name} className={unit.own ? 'unit-img' : 'unit-img unit-hide' } />
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