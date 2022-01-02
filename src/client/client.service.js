import Constants from "../common/constants";

class ClientService {
    client = null;

    constructor(client) {
        this.client = client;
    }

    #sendCommand(commandName, options) {
        this.client.sendCommand(commandName, options);
    }

    createUser(id, user, pass) {
        this.#sendCommand(Constants.Commands.Make, {user, pass, id})
    }

    connectUser(user, pass) {
        this.#sendCommand(Constants.Commands.Connect, {user, pass})
    }

    sendPrivateMessage(message, to) {
        this.#sendCommand(Constants.Commands.PM, {message_len: message.length, to, message_body: message})
    }
}

export default ClientService;