import React, { Component } from 'react'
import lodash from 'lodash'
import unitsObj from '../units.json'
// eslint-disable-next-line
import firebase, { auth, provider } from '../firebase'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import StarIcon from 'material-ui-icons/Star'
import About from './about'
import PlayerInfo from './PlayerInfo'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import Unit from './Unit'
import './css/units.css'
import 'font-awesome/css/font-awesome.min.css'

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
            sortField: 'name',
            unitsListed: [],
            userUnitList: [],
            user: props.match.params.pid,
            star: 5,
            filter: '',
        }
        this.changeFilter = this.changeFilter.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
        this.updateOwnedList = this.updateOwnedList.bind(this);
    }

    handleChange = (star) => {
        this.setState({ star });
    };
    
    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    updateOwnedList() {
        if (!this.state.user) {
            console.warn('updateOwnedList(): no user');
            return;
        }
        const refUrl = `ffbexvius/users/${this.state.user}/units/`;
        firebase.database()
            .ref(refUrl)
            .on('value', snapshot => {
                const storedUnits = snapshot.val();
                const ownedArray = Object.keys(storedUnits)
                    .map(unitId => {
                        const obj = storedUnits[unitId];
                        if (obj.own) return parseInt(unitId, 10);
                        return null;
                    })
                    .filter(unitId => !!unitId);
                this.setState({
                    userUnitList: ownedArray,
                });
            });
    }

    componentWillMount(props) {
        this.setState({
            unitsListed: Object.values(unitsObj).sort((a, b) => a.name.localeCompare(b.name)),
            value: 0,
        })
    }

    componentDidMount() {
        firebase.database().ref(`ffbexvius/users/${this.state.user}/units/`).on('value', (snapshot)  => { //jogar isso dentro do if acima para não ficar dando erro no console
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
        this.setState(
            this.updateOwnedList
        );
        //apenas recebe informações do usuário (sem units)
        firebase.database().ref(`ffbexvius/users/${this.state.user}/info/`).on('value', (snapshot) => {
            if(snapshot.val() !== null) {
                this.setState({ ffbeid: snapshot.val().player_id })
            } else {
                console.log('não possui Game ID cadastrado')
            }
        })
    }

    renderUnitsList() {
        const { star, unitsListed } = this.state
        const filteredUnits = star > 0
            ? unitsListed.filter(unit => unit.rarity_min === star)
            : unitsListed.filter(unit => unit.own === true);
        const remainingUnits = filteredUnits.filter(unit => {
            if (!this.state.filter || this.state.filter === '') return true;
            return unit.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0;
        })
        .sort((a, b) => {
            const fieldName = this.state.sortField;
            return a[fieldName].localeCompare(b[fieldName]);
        })
        .map(unit => (
            <Unit
                key={`unit-entry-${unit.unit_id}`}
                name={unit.name}
                unitId={parseInt(unit.unit_id, 10)}
                img={unit.img}
                own={this.state.userUnitList.indexOf(parseInt(unit.unit_id, 10)) >= 0}
                onClick={this.addUnitToMyList}
            />
        ));
        console.log(remainingUnits)
        if (remainingUnits.length > 0) return remainingUnits;
        return (
            <div>
                No units to display
            </div>
        );
    }

    resetFilters() {
        this.setState({
            filter: '',
            sortField: 'name',
        });
        document.getElementById('filter').value = ''
    }

    changeFilter(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    renderFilter() {
        const { classes } = this.props
        return (
            <div className="filter-bar">
                <TextField id="filter" name="filter" label="Filter" className={classes.textField} onChange={this.changeFilter} margin="normal" />
                <Select native name="sortField" value={this.state.sortField} onChange={this.changeFilter} className={classes.selectEmpty} >
                    <option value={'name'}>NAME</option>
                    <option value={'unit_id'}>ID</option>
                    <option value={'job'}>JOB</option>
                </Select>
                <Button raised color="primary" className={classes.button} onClick={this.resetFilters}>
                    CLEAR FILTERS
                </Button>
            </div>
        )
    }

    render() {
        return (
            <div className='main'>
                <aside className='sidebar'>
                    {this.state.ffbeid ? <PlayerInfo ffbeid={this.state.ffbeid} /> : ''}
                    <About />
                </aside>
                <div className='list'>
                    <AppBar position="static" color="default">
                        <Button onClick={() => this.handleChange(5)}>
                            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                        </Button>
                        <Button onClick={() => this.handleChange(4)}>
                            <StarIcon /><StarIcon /><StarIcon /><StarIcon />
                        </Button>
                        <Button onClick={() => this.handleChange(3)}>
                            <StarIcon /><StarIcon /><StarIcon />
                        </Button>
                        <Button onClick={() => this.handleChange(2)}>
                            <StarIcon /><StarIcon />
                        </Button>
                        <Button onClick={() => this.handleChange(1)}>
                            <StarIcon />
                        </Button>
                        <Button onClick={() => this.handleChange(0)}>
                            ALL
                        </Button>
                    </AppBar>
                    <div className='listagem'>
                        {this.renderFilter()}
                        <div className='unitList'>
                            {this.renderUnitsList()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Player)