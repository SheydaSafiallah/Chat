import {io} from "socket.io-client";

class Client {
    #protocol = null;
    #client = null;

    constructor(host, port, protocol) {
        this.#protocol = protocol;

        this.#client = io(`http://${host}:${port}`);
        this.#client.on('connect', () => {
            //TODO: handle client connection
            console.log("Client Connected!")
        })
    }

    sendCommand(commandName, options) {
        const commandObject = {
            commandName, ...options
        };

        this.#client.emit('command', this.#protocol.commandToString(commandObject));
    }
}


export default Client;