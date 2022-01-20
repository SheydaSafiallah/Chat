import $ from "jquery";
import Client from "./client";
import Constants from "../common/constants";
import ClientService from "./client.service";

class CommandExecutor {
    execute({commandName, ...options}) {
        switch (commandName) {
            case Constants.Commands.Error:
                return this.#error(options);
            case Constants.Commands.UserAccepted:
                return this.#userAccepted(options);
            case Constants.Commands.UserNotAccepted:
                return this.#userNotAccepted(options);
            case Constants.Commands.Connected:
                return this.#connected(options);
            default:
                throw new Error("Unknown Command")
        }
    }

    #error = ({reason}) => {
        alert(reason)
    }

    #userAccepted = ({id , sid}) => {
        alert("userAccepted, id: " + id)
        localStorage.setItem(Constants.LocalStorage.UserID, id);
        localStorage.setItem(Constants.LocalStorage.Session, sid);
        window.location.href = '/chat'


    }

    #userNotAccepted = ({reason}) => {
        alert("userNotAccepted: " + reason)
    }

    #connected = ({sid}) => {
        localStorage.setItem(Constants.LocalStorage.Session, sid);
        window.location.href = '/chat'
    }
}

const login = () => {
    const client = new Client(Constants.hostname, Constants.port);
    const clientService = new ClientService(client);
    client.setCommandExecutor(new CommandExecutor())
    $("#loginBtn").click(() => {
        const userId = $('#login input[name="id"]').val()
        localStorage.setItem(Constants.LocalStorage.UserID, userId);
        clientService.connectUser(userId, $('#login input[name="password"]').val());
    })

    $("#signUpBtn").click(() => {
        clientService.createUser($('#signup input[name="id"]').val(), $('#signup input[name="userName"]').val(), $('#signup input[name="password"]').val());
    })

}

export default login