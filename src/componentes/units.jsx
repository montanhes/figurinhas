import React, { Component } from 'react'
import unitsObj from '../units.json'
// eslint-disable-next-line
import firebase, { auth, provider } from '../firebase'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import SwipeableViews from 'react-swipeable-views'
import Tabs, { Tab } from 'material-ui/Tabs'
import StarIcon from 'material-ui-icons/Star'
import About from './about'
import User from './user'
import './css/units.css'
import 'font-awesome/css/font-awesome.min.css'
import Unit from './Unit';

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

class Units extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortField: 'name',
            filter: '',
            user: null,
            userUnitList: [],
            value: 0,
        };

        this.addUnitToMyList = this.addUnitToMyList.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.resetFilters = this.resetFilters.bind(this);
        this.updateOwnedList = this.updateOwnedList.bind(this);
    }

    handleChange = (event, value) => {
        this.setState({ value });
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
            {user},
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

    renderUnitsList(star) {
        const unitsListed = Object.keys(unitsObj).map(key => unitsObj[key]);
        const filteredUnits = star > 0
            ? unitsListed.filter(unit => unit.rarity_min === star)
            : unitsListed;

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
      return (
        <div className="filter-bar">
          <span>
            <label>Filter</label>
            <input type="text" name="filter" onChange={this.changeFilter} value={this.state.filter} />
          </span>
          <span><select name="sortField" value={this.state.sortField} onChange={this.changeFilter}>
            <option value="name">Name</option>
            <option value="unit_id">ID</option>
            <option value="job">Job</option>
          </select></span>
          <span>
            <button onClick={this.resetFilters}>Clear Filters</button>
          </span>
        </div>
      )
    }

    render() {
        const { theme } = this.props
        return (
            <div className='main'>
                <aside className='sidebar'>
                    {this.state.user ?
                    <User userInfo={this.state.user} /> : '' }
                    <About />
                </aside>
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
                            {this.renderFilter()}
                            <div className='unitList'>
                                {this.renderUnitsList(5)}
                            </div>
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                            {this.renderFilter()}
                            <div className='unitList'>
                                {this.renderUnitsList(4)}
                            </div>
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                            {this.renderFilter()}
                            <div className='unitList'>
                                {this.renderUnitsList(3)}
                            </div>
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                            {this.renderFilter()}
                            <div className='unitList'>
                                {this.renderUnitsList(2)}
                            </div>
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                            {this.renderFilter()}
                            <div className='unitList'>
                                {this.renderUnitsList(1)}
                            </div>
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                            {this.renderFilter()}
                            <div className='unitList'>
                                {this.renderUnitsList(0)}
                            </div>
                        </TabContainer>
                    </SwipeableViews>
                </div>
            </div>
        )
    }
}

Units.propTypes = {
    theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(Units)
