//import UnitsObj from './units.json'
let UnitsObj = require('./units.json')

Object.keys(UnitsObj).forEach(function(key) {
    UnitsObj[key].limited = false
})

console.log(UnitsObj)


//312000404