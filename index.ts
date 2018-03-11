'use strict';

//
// Create the HTTP server and serve our index.html
//

import {Server} from "http";

let server:Server = require('http').createServer(function incoming(req, res) {
  res.setHeader('Content-Type', 'text/html');
  require('fs').createReadStream(__dirname + '/index.html').pipe(res);
});

//
// Attach Primus to the HTTP server.
//
let Primus = require('primus');
let primus = new Primus(server);

//
// Listen for connections and echo the events send.
//
let connections:Array<any> = [];
primus.on('connection', function connection(spark) {
    connections.push(spark);
  spark.on('data', function received(data) {
    console.log(spark.id, 'received message:', data);

    for(let connection of connections){
        connection.write(data);
    }
  });
});


server.listen(8080, function () {
  console.log('Open http://localhost:8080 in your browser');
});
