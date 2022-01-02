import ServerService from "./server.service";
import Server from "./server";
import Constants from "../common/constants";
import './query'

const main = ()=>{
    const service = new ServerService()
    const server = new Server(Constants.port, service);
}


main();