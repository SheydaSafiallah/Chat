import $ from "jquery";
import login from "./login";
import chat from "./chat";

window.initializer = {
    login(){
        $(login())
    },
    chat(){
        $(chat())
    }
}