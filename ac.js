var http = require('http');
var urlparser = require('url');
var htmlparser = require('htmlparser2')

function download(url, callback) {
  url = urlparser.parse(url)
  http.get({hostname:url.hostname, path:url.path}, function(res) {
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
  download(url, function(data) {
    var parse = new htmlparser.Parser({
      onopentag: function (name, attribs) {
        if (name === "link" && attribs.type === "text/css") {
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
