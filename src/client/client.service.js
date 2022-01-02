import Constants from "../common/constants";

class ClientService {
    client = null;

    constructor(client) {
        this.client = client;
    }

    #sendCommand(commandName, options) {
        this.client.sendCommand(commandName, options);
    }

    createUser(user, pass, id) {
        this.#sendCommand(Constants.Commands.Make, {user, pass, id})
    }

    connectUser(user, pass) {
        this.#sendCommand(Constants.Commands.Connect, {user, pass})
    }
}

export default ClientService;