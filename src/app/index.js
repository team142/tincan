'use strict';
exports.__esModule = true;
var server = require('http').createServer(function incoming(req, res) {
    res.setHeader('Content-Type', 'text/html');
    require('fs').createReadStream(__dirname + '/index.html').pipe(res);
});
//
// Attach Primus to the HTTP server.
//
var Primus = require('primus');
var primus = new Primus(server);
//
// Listen for connections and echo the events send.
//
var connections = [];
primus.on('connection', function connection(spark) {
    connections.push(spark);
    spark.on('data', function received(data) {
        console.log(spark.id, 'received message:', data);
        for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
            var connection_1 = connections_1[_i];
            connection_1.write(data +"AWESOME");
        }
    });
});
server.listen(8080, function () {
    console.log('Open http://localhost:8080 in your browser');
});
