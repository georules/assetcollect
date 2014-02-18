var http = require('http');
var urlparser = require('url');
var htmlparser = require('htmlparser2')

function download(url, callback) {
  url = urlparser.parse(url)
  http.get({hostname:url.hostname, path:url.path}, function(res) {
    console.log("Status: " + res.statusCode)
    console.log(res.headers.location)
    data = ""
    res.on('data', function(chunk) {
      data += chunk
    })
    res.on('error', function(e) {
      console.log(e.message)
    })
    res.on('end', function() {
      callback(data)
    })
  })
}

function ac(url) {
  download(url, function(data) {
    var parse = new htmlparser.Parser({
      onopentag: function (name, attribs) {
        if (name === "link" && (attribs.rel === "stylesheet" || attribs.type === "text/css")) {
          console.log(attribs.href);
        }
      }
    })
    parse.write(data)
    parse.end()
  })
}

module.exports = {
  download: download,
  ac: ac
}
