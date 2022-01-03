import Constants from "../common/constants";
import {allUsers, createSessionId, createUser, findUser, getGroupParticipants, savePrivateMessage} from "./query";
import {v4 as uuid} from 'uuid'

class ServerService {
    executeCommand({commandName, ...options}, user) {
        switch (commandName) {
            case Constants.Commands.Make:
                return this.#createUser(options);
            case Constants.Commands.Connect:
                return this.#connectUser(options);
            case Constants.Commands.PM:
                return this.#sendPrivateMessage(options, user);
            case Constants.Commands.Users:
                return this.#sendUsers(options, user)
            default:
                throw new Error("Unknown Command")
        }
    }

    #createUser = ({user, pass, id}) => {
        if (findUser(id)) {
            return {
                commandName: Constants.Commands.UserNotAccepted,
                options: {
                    reason: 'This user id has been created before'
                }
            }
        }

        createUser(id, user, pass);

        return {
            commandName: Constants.Commands.UserAccepted,
            options: {
                id
            }
        }
    }

    #connectUser = ({user, pass}) => {
        const foundUser = findUser(user);

        if (!foundUser) {
            throw new Error("User was not found.")
        }

        if (foundUser.Password !== pass) {
            throw new Error("Password is incorrect.")
        }

        const sid = uuid();
        createSessionId(sid, foundUser.ID)

        return {
            commandName: Constants.Commands.Connected,
            options: {
                id: foundUser.id,
                sid
            }
        }
    }

    #sendPrivateMessage = ({message_len, to, message_body}, user) => {
        if (message_body.length !== +message_len) {
            throw new Error("Message is corrupted.")
        }

        savePrivateMessage(user.ID, to, message_body, Math.floor(Date.now() / 1000));

        return {
            rooms: [to,user.ID],
            commandName: Constants.Commands.PM,
            options: {
                from: user.ID,
                to,
                message_len,
                message_body
            },
        }
    }

    #sendUsers = ({group}, user) => {
        let participants = [];

        if (group) {
            participants = getGroupParticipants(group);
            if (!participants.includes(user.ID)) {
                throw new Error("The user is not a member of this group.");
            }
        } else {
            //TODO: just return those users who you have a private chat
            participants = allUsers()
        }

        return {
            commandName: Constants.Commands.UsersList,
            options: {
                users: participants.join('|')
            }
        }
    }
}

export default ServerService;