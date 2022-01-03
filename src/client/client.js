import {io} from "socket.io-client";
import BaseClient from "../common/base-client";
import Protocol from "../common/protocol";

class Client extends BaseClient {
    #commandExecutor = null;

    constructor(host, port, commandExecutor, sessionId = null) {
        super(io({transports: ['websocket'], auth: {sessionId}}))
        this.#commandExecutor = commandExecutor
        this.io.on('command', (commandString) => {
            this.#onCommand(commandString)
        })
    }

    #onCommand(commandString) {
        try {
            const commandObject = Protocol.stringToCommand(commandString);
            this.#commandExecutor.execute(commandObject)
        } catch (error) {
            alert(error.message)
        }
    }
}


export default Client;