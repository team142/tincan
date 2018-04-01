'use strict';

//
// Create the HTTP server and serve our index.html
//


import {Server} from "sockjs";
import * as http from "http";

export class ChatServer {
    //Dependency Injected Variables

    //Class scope variables
    private sockJs;
    private httpServer: http.Server;
    constructor(sockJs){
        this.sockJs = sockJs;
        this.httpServer = http.createServer();

    }

    start (){
        let connections: Array<any> = [];
        let sockJsServer: Server = this.sockJs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
        sockJsServer.on('connection', function(currentConnection) {
            connections.push(currentConnection);
            currentConnection.on('data', function(message) {
                for(let connection of connections){
                    connection.write(message);
                }
            });
            currentConnection.on('close', function() {});
        });

        sockJsServer.installHandlers(this.httpServer, {prefix:'/echo'});
        this.httpServer.listen(9999, '0.0.0.0');
    }

    stop () {
        this.httpServer.removeAllListeners();
        this.httpServer.close(() => {
            process.exit();
        });
    }
}

