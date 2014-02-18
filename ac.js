var http = require('http');

function download(url, callback) {
  http.get({hostname:url}, function(res) {
    data = ""
    res.on('data', function(chunk) {
      data += chunk
    })
    res.on('end', function() {
      callback(data)
    })
  })
}

function ac(url) {
  if (url.substring(0,"http://".length) === "http://") {
    url = url.substring("http://".length)
  }
  download(url, function(data) {
    console.log(data)
  })
}

if (typeof(process.argv) != "undefined") {
  if(typeof(process.argv[2]) != "undefined") {
    ac(process.argv[2])
  }
  else {
    console.log("provide an http location")
  }
}

