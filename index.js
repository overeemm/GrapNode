var RxServer = require("rx-http-server");

var server = new RxServer();

server.requests.subscribe(function(data) {
    data.response.writeHead(200, {"Content-Type": "text/plain"});
    data.response.end("Hello from Rx!");
});

server.listen(8080);