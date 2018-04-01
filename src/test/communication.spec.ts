import {ChatServer} from "../app/chatServer";
import 'mocha';
//import 'primus'
describe('Send chat', () => {
    it('should be received by all clients', () => {

        const SockJS = require('sockjs-client');

        const chatServer:ChatServer = new ChatServer(require('sockjs'));


        chatServer.start();

        const sockClient1 = new SockJS('http://0.0.0.0:9999/echo');

        sockClient1.onopen = function() {
            console.log('open');
        };

        sockClient1.onclose = function() {
            console.log('closing client');
        };

        sockClient1.onmessage = function(e) {
            console.log(e.data);
        };


        const sockClient2 = new SockJS('http://0.0.0.0:9999/echo');

        sockClient2.onopen = function() {
            console.log('open');
        };

        sockClient2.onclose = function() {
            console.log('closing client');
        };


        Promise.all([sockClient1.onopen, sockClient2.onopen]).then(()=> {
            console.log("DOOO IIT");
            sockClient2.send("sock client 2 message");
            // all loaded
        }, ()=> {
            console.log("FAILURE!!!")
            // one or more failed
        });


        Promise.all([sockClient1.onmessage, sockClient2.onmessage]).then((s1)=> {
            console.log("EVERYTHING WORKED");
            console.log("MESSAGE: " + s1.values().next());
            chatServer.stop();
            // all loaded
        }, ()=> {
            // one or more failed
        });

    });
});
