var fs = require("fs"),
  http = require("http"),
  request = require('request'),
  url = require('url'),
  marked = require('marked'),
  Firebase = require('firebase');

http.createServer(responseHandler).listen(process.env.PORT || 8888);
var ref = new Firebase("https://markdown-renderer.firebaseio.com/");
var mdRef = ref.child('markdown');
var htmlRef = ref.child('html');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

function responseHandler(req, res) {
  if (req.url.match("fav")) {
    res.end("");
    return;
  }

  var markdownRegex = /\/markdown\//;
  if (req.url === "/") {
    res.writeHead(200, {"Content-Type": "text/html"});
    fs.readFile('index.html', 'utf8', function (err,data) {
      res.end(data);
    });
  }else if(req.url.match(markdownRegex)){
    var md2process = decodeURIComponent(req.url.replace(markdownRegex, ''));
    res.end(marked(md2process));
  }
  else{
    res.end('<h1>this is not the page you\'re looking for O.o</h1>');
  }
}

