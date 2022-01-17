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

    getUsers(group) {
        this.#sendCommand(Constants.Commands.Users, {group})
    }
    ///imp
    getGroupUsers(group) {
        this.#sendCommand(Constants.Commands.GroupUsersList, {group})
    }


    // message and id of gp send to server
    sendGroupMessage(message, to){
        this.#sendCommand(Constants.Commands.GM, {message_len:message.length , to, message_body: message})
    }
    //
    getGroups(){
        this.#sendCommand(Constants.Commands.GroupList,{} )
    }

    //imp2
    makeGroup(user, gname){
        this.#sendCommand(Constants.Commands.Group, {user, gname})
    }

}

export default ClientService;