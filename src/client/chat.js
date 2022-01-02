import $ from "jquery";
import Client from "./client";
import Constants from "../common/constants";
import ClientService from "./client.service";

class CommandExecutor {
    execute({commandName, ...options}) {
        switch (commandName) {
            case Constants.Commands.Error:
                return this.#error(options);
            default:
                throw new Error("Unknown Command")
        }
    }

    #error = ({reason}) => {
        alert(reason)
    }

}

const chat = () => {
    const sessionId = localStorage.getItem(Constants.LocalStorage.Session);
    const client = new Client(Constants.hostname, Constants.port, new CommandExecutor(), sessionId);
    const clientService = new ClientService(client);

    $('#sendMessage').click(
        () => {
            clientService.sendPrivateMessage($('#messageInput').val(), 7)
        }
    )

}

export default chat