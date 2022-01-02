import Protocol from "./protocol";

class BaseClient {
    io = null;

    constructor(io) {
        this.io = io;
    }

    sendCommand(commandName, options) {
        const commandObject = {
            commandName, ...options
        };

        this.io.emit('command', Protocol.commandToString(commandObject));
    }
}

export default BaseClient