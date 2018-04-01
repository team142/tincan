import {ChatServer} from "../app/chatServer";
import 'mocha';
import {assert} from "chai";

describe('Send chat', () => {
    it('should be received by all clients', () => {

        const SockJS = require('sockjs-client');
        const chatServer:ChatServer = new ChatServer(require('sockjs'));
        chatServer.start();

        const sockClient1 = new SockJS('http://0.0.0.0:9999/echo');
        let sockClient1Message = "";



        let socketClient1Opened = new Promise(function (resolve) {
            sockClient1.onopen = function () {
                resolve();
            };
        });
        let socketClient1Messaged = new Promise(function (resolve) {
            sockClient1.onmessage = function (e) {
                sockClient1Message = e.data;
                resolve();
            };
        });

        const sockClient2 = new SockJS('http://0.0.0.0:9999/echo');
        let sockClient2Message = "";


        let socketClient2Opened = new Promise(function (resolve) {
            sockClient2.onopen = function () {
                resolve();
            };
        });

        let socketClient2Messaged = new Promise(function (resolve) {
            sockClient2.onmessage = function (e) {
                sockClient2Message = e.data;
                resolve();
            };
        });

        Promise.all([socketClient1Opened, socketClient2Opened]).then(()=> {
            sockClient2.send("sock client 2 message");
        }, ()=> {
            // one or more failed
        });

        Promise.all([socketClient1Messaged, socketClient2Messaged]).then((s1)=> {
            assert.equal(sockClient1Message, sockClient2Message, "Both clients should receive the message. ");
            console.log("AMAZING");
            chatServer.stop();
            console.log("STOPPED");
        }, ()=> {
        });
    });
});
