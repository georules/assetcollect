var ac = require('./ac.js')

if (typeof(process.argv) != "undefined") {
  if(typeof(process.argv[2]) != "undefined") {
    ac.ac(process.argv[2])
  }
  else {
    console.log("provide an http location")
  }
}
