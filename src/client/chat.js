import $ from "jquery";
import Protocol from "../common/protocol";
import Client from "./client";
import Constants from "../common/constants";
import ClientService from "./client.service";

const chat = () => {
    console.log("Init chat1")
    $("#login").click(() => {
        const protocol = new Protocol();
        const client = new Client(Constants.hostname, Constants.port, protocol);
        const clientService = new ClientService(client);

        clientService.createUser('Sheyda', '1234', '12');
    })
}

export default chat