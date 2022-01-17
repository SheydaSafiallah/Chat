import {io} from "socket.io-client";
import BaseClient from "../common/base-client";
import Protocol from "../common/protocol";

class Client extends BaseClient {
    #commandExecutor = null;

    constructor(host, port, sessionId = null) {
        super(io({transports: ['websocket'], auth: {sessionId}}))
        this.io.on('command', (commandString) => {
            this.#onCommand(commandString)
        })
    }

    setCommandExecutor(commandExecutor){
        this.#commandExecutor = commandExecutor
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