import io from "socket.io";
import express from 'express'
import http from 'http'
import {getDirName} from "./helper";
import BaseClient from "../common/base-client";
import Constants from "../common/constants";
import Protocol from "../common/protocol";
import {findUserBySessionId} from "./query";

class Server {
    #service = null;
    #server = null;
    #io = null;
    #app = null;

    constructor(port, service) {
        this.#service = service;
        this.#app = express()
        this.#server = http.createServer(this.#app);
        this.#io = new io.Server(this.#server, {transports: ['websocket']});

        this.#app.use(express.static(getDirName() + '/static'))
        this.#io.on("connection", (socket) => {
            this.#onNewConnection(socket)
        });

        this.#server.listen(port)
    }

    #onNewConnection(socket) {
        const client = new BaseClient(socket);
        const user = findUserBySessionId(socket.handshake.auth.sessionId)

        socket.on('command', (commandString) => {
            this.#onCommand(commandString, client,user)
        })
    }

    #onCommand(commandString, client,user) {
        try {
            const commandObject = Protocol.stringToCommand(commandString);
            const result = this.#service.executeCommand(commandObject,user);
            if (result) {
                client.sendCommand(result.commandName, result.options)
            }
        } catch (error) {
            client.sendCommand(Constants.Commands.Error, {reason: error.message})
        }
    }
}


export default Server