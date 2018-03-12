import {ChatServer} from "../app/chatServer";
import { expect } from 'chai';
import 'mocha';
import 'primus'
let Primus = require('primus');
describe('Send chat', () => {
    it('should be received by all clients', () => {

        const server = require('http').createServer(function incoming(req, res) {
            res.setHeader('Content-Type', 'text/html');
            require('fs').createReadStream(__dirname + '/index.html').pipe(res);
        });

        const primus = new Primus(server, { pingInterval: false });
        const chatServer:ChatServer = new ChatServer(require('primus'));
        chatServer.start();

        let output = "";
        primus.on('data', function received(data) {
            output = data;
            expect(output).to.equal("Value1");
        });
        primus.write("Value1");
    });
});
