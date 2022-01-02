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

    #userAccepted = ({id}) => {
        alert("id: " + id)
    }

    #userNotAccepted = ({reason}) => {
        alert("not: " + reason)
    }

    #connected = ({sid})=>{
        localStorage.setItem(Constants.LocalStorage.Session,sid);
        window.location.href='/chat'
    }
}

const login = () => {
    const client = new Client(Constants.hostname, Constants.port, new CommandExecutor());
    const clientService = new ClientService(client);

    $("#loginBtn").click(() => {
        clientService.connectUser($('#login input[name="id"]').val(), $('#login input[name="password"]').val());
    })

    $("#signUpBtn").click(() => {
        clientService.createUser($('#signup input[name="id"]').val(), $('#signup input[name="userName"]').val(), $('#signup input[name="password"]').val());
    })

}

export default login