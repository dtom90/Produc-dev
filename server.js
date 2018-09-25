const http = require('http');

const finalHandler = require('finalhandler');
const serveStatic = require('serve-static');

const serve = serveStatic("./dist");

const server = http.createServer(function(req, res) {
  const done = finalHandler(req, res);
  serve(req, res, done);
});

const port = 8080;

// eslint-disable-next-line no-console
console.log('Listening on port '+port)
server.listen(port);