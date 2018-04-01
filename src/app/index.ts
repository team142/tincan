'use strict';
import {ChatServer} from './chatServer';

//
// Create the HTTP server and serve our index.html
//


let sockjs = require('sockjs');
let chatServer = new ChatServer(sockjs);
chatServer.start();

