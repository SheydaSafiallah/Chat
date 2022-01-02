import Protocol from "../common/protocol";
import ServerService from "./server.service";
import Server from "./server";
import Constants from "../common/constants";

const main = ()=>{
    const protocol = new Protocol();
    const service = new ServerService()
    const server = new Server(Constants.port, protocol,service);
}


main();