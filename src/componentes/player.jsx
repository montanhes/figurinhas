import React, { Component } from 'react'
import './css/units.css'
import lodash from 'lodash'
import unitsObj from '../units.json'
// eslint-disable-next-line
import firebase, { auth, provider } from '../firebase'
import 'font-awesome/css/font-awesome.min.css'

class Units extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            unitsListed: [],
            user: props.match.params.pid,
        }
    }

    componentWillMount() {
        this.setState({
            unitsListed: lodash.values(unitsObj)
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
        const filteredUnits = unitsListed.filter(unit => unit.rarity_min === star)
        return filteredUnits.map(unit => (
            <div key={unit.unit_id} className='unit'>
                <a>
                    <img id={unit.unit_id} src={unit.img} alt={unit.name} className={unit.own ? 'unit-img' : 'unit-img unit-hide' } />
                </a>
                <div>{unit.name}</div>
            </div>
        )   )
    }

    render() {
        return (
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
        )
    }
}

export default Units