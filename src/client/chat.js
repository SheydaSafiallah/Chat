import $ from "jquery";
import Client from "./client";
import Constants from "../common/constants";
import ClientService from "./client.service";

let selectedChat = null;
let currentUser = localStorage.getItem(Constants.LocalStorage.UserID)
let isGroup = false;

class CommandExecutor {
    execute({commandName, ...options}) {
        switch (commandName) {
            case Constants.Commands.Error:
                return this.#error(options);
            case Constants.Commands.UsersList:
                return this.#usersList(options);
            case Constants.Commands.PM:
                return this.#privateMessage(options)
            case Constants.Commands.GM:
                return this.#groupMessage(options);
            case Constants.Commands.GroupUsersList:
                return this.#groupUsersList(options);
            default:
                throw new Error("Unknown Command")
        }
    }

    #error = ({reason}) => {
        alert(reason)
    }

    #usersList = ({users: usersString}) => {
        const users = usersString.split("|");
        users.forEach((user) => {
            const userElement = $('<li class="person">\n' +
                '<span class="name">' + user + '</span>\n' +
                '</li>')
            userElement.click(
                () => {
                    $('.active').removeClass('active');
                    userElement.addClass('active');
                    selectedChat = user;
                    $('#toName').text(user)
                }
            )
            $(".people").append(
                userElement
            )
        })
    }

    ////imp group -> make bubble of group msg
    #groupMessage = ({from, to, message_len, message_body}) => {
        if (message_body.length !== +message_len) {
            throw new Error("Message is corrupted.")
        }
        if (currentUser === from && selectedChat === to || selectedChat === from && currentUser === to) {
            const chatElement = $('<div class="bubble"></div>')
            chatElement.addClass(from === currentUser ? 'me' : 'you')
            chatElement.text(from+": "+message_body)
            $('.chat').append(chatElement)
        }
    }


    ///imp group users list
    #groupUsersList = ({users: usersString}) => {
        const groupUsers = usersString.split("|");
        groupUsers.forEach((user) => {
            const groupUserElement = $('<li class="participant">\n' +
                '<span class="Participantname">' + user + '</span>\n' +
                '</li>')
            groupUserElement.click(
                () => {
                    $('.active').removeClass('active');
                    groupUserElement.addClass('active');
                    selectedChat = user;
                    $('#toName').text(user)
                }
            )
            $(".participants").append(
                groupUserElement
            )
        })
    }



    #privateMessage = ({from, to, message_len, message_body}) => {
        if (message_body.length !== +message_len) {
            throw new Error("Message is corrupted.")
        }
        if (currentUser === from && selectedChat === to || selectedChat === from && currentUser === to) {
            const chatElement = $('<div class="bubble"></div>')
            chatElement.addClass(from === currentUser ? 'me' : 'you')
            chatElement.text(message_body)
            $('.chat').append(chatElement)
        }
    }
}

const chat = () => {
    if (!currentUser) {
        window.location.href = '/login'
        return;
    }
    const sessionId = localStorage.getItem(Constants.LocalStorage.Session);
    const client = new Client(Constants.hostname, Constants.port, new CommandExecutor(), sessionId);
    const clientService = new ClientService(client);

    $('#sendMessage').click(
        () => {
            if (isGroup) {
                clientService.sendGroupMessage($('#messageInput').val(), selectedChat)
            }
            else {
                clientService.sendPrivateMessage($('#messageInput').val(), selectedChat)
            }
        }
    )

    clientService.getUsers();
}

export default chat