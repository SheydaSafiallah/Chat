import $ from "jquery";
import Client from "./client";
import Constants from "../common/constants";
import ClientService from "./client.service";

let selectedChat = null;
let currentUser = localStorage.getItem(Constants.LocalStorage.UserID)
let isGroup = false;


class CommandExecutor {
    #clientService = null;

    constructor(clientService) {
        this.#clientService = clientService;
    }

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
            case Constants.Commands.GroupList:
                return this.#groupList(options);
            case Constants.Commands.UserJoint:
                return this.#userJoint(options);
            case Constants.Commands.UserLeave:
                return this.#userLeft(options);
            default:
                throw new Error("Unknown Command")
        }
    }

    #error = ({reason}) => {
        alert(reason)
    }
    //imp2
    #userJoint = ({user,group}) => {
        if (user===currentUser){
            const groupElement = $('<li class="group">\n' +
                '<span class="groupName">' + group + '</span>\n' +
                '</li>')
            groupElement.click(
                () => {
                    $('.active').removeClass('active');
                    groupElement.addClass('active');
                    selectedChat = group;
                    isGroup = true;
                    $('#toName').text(group)
                    this.#clientService.getGroupUsers(group);
                }
            )
            $(".groups").append(
                groupElement
            )

            $('.active').removeClass('active');
            groupElement.addClass('active');
            selectedChat = group;
            isGroup = true;
            $('#toName').text(group)
        }

        if (selectedChat===group){
            const chatElement = $('<div class="bubble"></div>')
            chatElement.text(user === currentUser ?  'Welcome' : user+' Joint!')
            $('.chat').append(chatElement)
        }
    }

///imp3
    #userLeft= ({user , group}) => {
        // alert("left")
        if (selectedChat === group){
            const chatElement = $('<div class="bubble"></div>')
            chatElement.text(user + 'Left')
            $('.chat').append(chatElement)

        }
    }




    //imp
    #groupList = ({groups: groupsString}) => {
        const groups = groupsString.split("|");
        groups.forEach((group) => {
            const groupElement = $('<li class="group">\n' +
                '<span class="groupName">' + group + '</span>\n' +
                '</li>')
            groupElement.click(
                () => {
                    $('.active').removeClass('active');
                    groupElement.addClass('active');
                    selectedChat = group;
                    isGroup = true;
                    $('#toName').text(group)
                    this.#clientService.getGroupUsers(group);
                }
            )
            $(".groups").append(
                groupElement
            )
        })
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
                    isGroup = false;
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
        if (selectedChat === to) {
            const chatElement = $('<div class="bubble"></div>')
            chatElement.addClass(from === currentUser ? 'me' : 'you')
            chatElement.text(from + ": " + message_body)
            $('.chat').append(chatElement)
        }
    }


    ///imp group users list
    #groupUsersList = ({participants: participantsString}) => {
        const groupUsers = participantsString.split("|");
        $(".participants").empty();
            groupUsers.forEach((user) => {
            const groupUserElement = $('<li class="participant">\n' +
                '<span class="Participantname">' + user + '</span>\n' +
                '</li>')
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
    const client = new Client(Constants.hostname, Constants.port, sessionId);
    const clientService = new ClientService(client);
    client.setCommandExecutor(new CommandExecutor(clientService))

    $('#sendMessage').click(
        () => {
            if (isGroup) {
                clientService.sendGroupMessage($('#messageInput').val(), selectedChat)
            } else {
                clientService.sendPrivateMessage($('#messageInput').val(), selectedChat)
            }
        }
    )
    $('#addbtn').click(
        ()=>
        {
            const groupName = $('#newGroupName').val()
            clientService.makeGroup(currentUser ,groupName);
        }
    )

    $('#leavebtn').click(
        ()=>
        {
            const leftGroupName = $('#newGroupName').val()
            clientService.leftGroup(currentUser, leftGroupName)
        }


    )

    clientService.getUsers();
    clientService.getGroups();
}

export default chat