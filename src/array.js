//import UnitsObj from './units.json'
const download = require('image-downloader')
let UnitsObj = require('./units.json')

let http = require('http')
let fs = require('fs')

Object.keys(UnitsObj).forEach(function(key) {
    //console.log(key +' - '+ UnitsObj[key].img.substr(UnitsObj[key].img.lastIndexOf('/') + 1))
    var file = fs.createWriteStream(UnitsObj[key].img.substr(UnitsObj[key].img.lastIndexOf('/') + 1))
    var request = http.get(UnitsObj[key].img, function(response) {
        response.pipe(file)
    })
})


//312000404