import Constants from "../common/constants";

class ServerService {
    executeCommand({commandName, ...options}) {
        switch (commandName) {
            case Constants.Commands.Make:
                this.#createUser(options);
                break;
            case Constants.Commands.Connect:
                this.#connectUser(options);
                break;
            default:
                throw new Error("Unknown Command")
        }
    }

    #createUser({user, pass, id}) {
        console.log(`Create a user: ${user} password: ${pass} id: ${id}`)
    }

    #connectUser({user, pass}) {
        console.log(`Connect a user: ${user} password: ${pass}`)
    }
}

export default ServerService;