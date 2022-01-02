import $ from "jquery";
import Protocol from "../common/protocol";
import Client from "./client";
import Constants from "../common/constants";
import ClientService from "./client.service";

const protocol = new Protocol();
const client = new Client(Constants.hostname, Constants.port, protocol);
const clientService = new ClientService(client);

const login = () => {

    $("#loginBtn").click(() => {
        clientService.connectUser($('#userNameInput').val(), $('#userNameInput').val());
    })

    $("#signUpBtn").click(() => {
        clientService.createUser($('#userNameInput').val(), $('#userNameInput').val(), $('#userNameInput').val());
    })
    
}

export default login