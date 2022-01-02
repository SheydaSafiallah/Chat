import fs from "fs";
import io from "socket.io";
import express from 'express'
import http from 'http'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

class Server {
    #protocol = null;
    #service = null;
    #server = null;
    #io = null;
    #app = null;

    constructor(port, protocol, service) {
        this.#protocol = protocol
        this.#service = service;
        this.#app = express()
        this.#server = http.createServer(this.#app);
        this.#io = new io.Server(this.#server);

        const __dirname = dirname(fileURLToPath(import.meta.url));
        this.#app.use(express.static(__dirname + '/static'))
        this.#io.on("connection", (socket) => {
            this.#onNewConnection(socket)
        });

        this.#server.listen(port)
    }

    #onNewConnection(socket) {
        socket.on('message', (data) => {
            this.#onMessage(data)
        })
        socket.on('file', (buffer) => {
            this.#onFile(buffer)
        })
        socket.on('command', (commandString) => {
            this.#onCommand(commandString)
        })
    }

    #onMessage(data) {
        console.log("Message: " + data)
    }

    #onFile(buffer) {
        fs.writeFile('/tmp/sheyda', buffer, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }

    #onCommand(commandString) {
        const commandObject = this.#protocol.stringToCommand(commandString);
        this.#service.executeCommand(commandObject)
    }
}


export default Server