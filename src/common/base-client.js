import Protocol from "./protocol";

class BaseClient {
    io = null;

    constructor(io) {
        this.io = io;
    }

    static sendSocketCommand(io, commandName, options) {
        const commandObject = {
            commandName, ...options
        };

        io.emit('command', Protocol.commandToString(commandObject));
    }

    sendCommand(commandName, options) {
        BaseClient.sendSocketCommand(this.io, commandName, options)
    }
}

export default BaseClient