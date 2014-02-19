var http = require('http');
var urlparser = require('url');
var htmlparser = require('htmlparser2')
var Promise = require('promise')

function download(url) {
  var promise = new Promise(function (resolve, reject) {
    parsedurl = urlparser.parse(url)
    http.get(parsedurl, function(res) {
      data = ""
      res.on('data', function(chunk) {
        data += chunk
      })
      res.on('error', function(e) {
        console.log(e.message)
      })
      res.on('end', function() {
        resolve(data.toString("utf-8").replace(/[\uFEFF]/g , ""))
      })
    })
  })
  return promise;
}

function ac(url) {
  cssdata = []
  todownload = []
  csspos = 0
  download(url).then(function(data) {
    var instyle = false;
    var incsspos
    var parse = new htmlparser.Parser({
      onopentag: function (name, attribs) {
        if (name === "link" && (attribs.rel === "stylesheet" || attribs.type === "text/css")) {
          thisurl = ""
          if(attribs.href.indexOf("http") >= 0) thisurl = attribs.href
          else thisurl = url+"/"+attribs.href
          todownload[csspos] = thisurl;
          csspos += 1
        }
        if (name === "style") {
          cssdata[csspos] = "/* {{on-page style data}} */\n"
          incsspos = csspos
          csspos += 1
        }
      },
      ontext: function(data) {
        if (incsspos > 0)  {
          cssdata[incsspos] += data
        }
      },
      onclosetag: function(name)  {
        if(name==="style")  {
          incsspos = 0;
        }
      },
    })
    parse.write(data)
    parse.end()
  }).then(function() {

    var promises = []
    todownload.forEach(function(url,i) {
      if(url !== "undefined") {
        promises.push(download(url).then(function(data){
          cssdata[i] = "/* {{"+url+"}} */\n" + data
        }))
      }
    })
    Promise.all(promises).then(function() {
      cssdata.forEach(function(data){
        console.log((data+"\n").toString("utf-8"))
      })
    })
  })
}

module.exports = {
  download: download,
  ac: ac
}
