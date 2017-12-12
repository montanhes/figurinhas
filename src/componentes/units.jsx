import React, { Component } from 'react'
import unitsObj from '../units.json'
// eslint-disable-next-line
import firebase, { auth, provider } from '../firebase'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import StarIcon from 'material-ui-icons/Star'
import Button from 'material-ui/Button'
import About from './about'
import User from './user'
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import './css/units.css'
import 'font-awesome/css/font-awesome.min.css'
import Unit from './Unit'

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
})

class Units extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortField: 'name',
            filter: '',
            user: null,
            userUnitList: [],
            star: 5,
        };

        this.addUnitToMyList = this.addUnitToMyList.bind(this);
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
        const user = this.state.user;
        const refUrl = `ffbexvius/users/${user.uid}/units/`;
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

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (!user) return;

            this.setState(
                { user },
                this.updateOwnedList
            );
        });
    }

    addUnitToMyList(e, unit_id) {
        if (!this.state.user) {
            // TODO: Inform the user that he's not logged in
            return;
        }

        e.preventDefault()
        const refUrl = `ffbexvius/users/${this.state.user.uid}/units/${unit_id}`;
        const currentUnitList = this.state.userUnitList;
        const own = currentUnitList.indexOf(unit_id) >= 0;

        if (!own) {
            firebase.database().ref(refUrl).set({
                own: true,
                unit_id: unit_id
            })
            const nextArray = [
                ...currentUnitList,
                unit_id,
            ];
            this.setState({
                userUnitList: nextArray,
            });
        } else {
            firebase.database().ref(refUrl).set({
                own: false,
                unit_id: unit_id
            })
            const nextArray = currentUnitList.filter(id => id !== unit_id);
            this.setState({
                userUnitList: nextArray,
            });
        }
    }

    renderUnitsList() {
        const { star } = this.state
        const unitsListed = Object.keys(unitsObj).map(key => unitsObj[key]);
        const filteredUnits = star > 0
            ? unitsListed.filter(unit => unit.rarity_min === star)
            : unitsListed;
            console.log(unitsListed)
        const remainingUnits = filteredUnits
            .filter(unit => {
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
                <TextField id="filter" name="filter" label="Filter" className={classes.textField} value={this.state.filter} onChange={this.changeFilter} margin="normal" />
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
                    {this.state.user ?
                        <User userInfo={this.state.user} /> : ''}
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

Units.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(Units)