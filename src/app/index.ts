'use strict';
import {ChatServer} from "./chatServer";

//
// Create the HTTP server and serve our index.html
//

let chatServer = new ChatServer(require('primus'));
chatServer.start();

