require('http').createServer(function handleRequest(req, res) {
  res.writeHead(200, { 'content-type': 'text/plain'});
  res.end('Hello World!');
}).listen(8080);