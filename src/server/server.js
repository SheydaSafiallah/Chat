import io from "socket.io";
import express from 'express'
import http from 'http'
import {getDirName} from "./helper";
import BaseClient from "../common/base-client";
import Constants from "../common/constants";
import Protocol from "../common/protocol";
import {findUserBySessionId, getGroupsThatUserIsMember} from "./query";

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
        const user = socket.handshake?.auth?.sessionId ? findUserBySessionId(socket.handshake.auth.sessionId) : null

        if (user) {
            socket.join(user.ID);

        }
        // TODO: join the socket to the other groups which is participant of.
        if (user){
            const groups = getGroupsThatUserIsMember(user.ID);
            groups.forEach(element => {
                socket.join(element)
                console.log(element)
            })

        }


        //TODO: group id and user id both should be unique.

        socket.on('command', (commandString) => {
            this.#onCommand(commandString, client, user)
        })
    }

    #onCommand(commandString, client, user) {
        try {
            const commandObject = Protocol.stringToCommand(commandString);
            const result = this.#service.executeCommand(commandObject, user);
            if (result) {
                if (result.join){
                    client.io.join(result.join)
                }

                if (result.rooms) {
                    result.rooms.forEach(room => {
                        BaseClient.sendSocketCommand(this.#io.to(room), result.commandName, result.options);
                    })
                } else {
                    client.sendCommand(result.commandName, result.options)
                }

            }
        } catch (error) {
            client.sendCommand(Constants.Commands.Error, {reason: error.message})
        }
    }
}


export default Server