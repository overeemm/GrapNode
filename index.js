var RxServer = require("rx-http-server"),
    phantom = require('node-phantom'),
    path = require("path"),
    fs = require("fs");

var server = new RxServer();
var requests = server.requests;

requests
  .filter(function (data) { return data.request.url === "/"; })
  .subscribe(function(data) {
    data.response.writeHead(200, {"Content-Type": "text/html"});
    data.response.end("<html><body><p>Tick <span></span></p>"+
      "<script src='/assets/tick.js' type='text/javascript'></script></body></html>");
  });

requests
  .filter(function (data) { return data.request.url === "/capture"; })
  .subscribe(function(data) {

    phantom.create(function(err,ph) {
      return ph.createPage(function(err,page) {
        return page.open("http://www.google.nl", function(err,status) {
          data.response.writeHead(200, {"Content-Type": "text/html"});
          page.renderBase64('PNG', function (err, base64) {
            data.response.end("<html><body><img src='data:image/png;base64," + base64 + "' /></body></html>");
            ph.exit();
          });
        });
      });
    }, {
      phantomPath: __dirname + "/phantomjs"
    });
  });

requests
  .filter(function (data) { return data.request.url.indexOf("/assets") === 0; })
  .subscribe(function(data) {
    var request = data.request,
        response = data.response,
        uri = request.url,
        filename = path.join(process.cwd(), uri);
  
    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }
   
      if (fs.statSync(filename).isDirectory()) filename += '/index.html';
   
      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }
   
        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
  });

requests
  .filter(function (data) { return data.request.url === "/time"; })
  .subscribe(function(data) {
    data.response.writeHead(200, {"Content-Type": "text/plain"});
    data.response.end(new Date().getTime().toString());
  });

server.listen(8080);