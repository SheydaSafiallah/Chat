import Constants from "../common/constants";
import {
    addGroupParticipant,
    allUsers,
    createGroup,
    createSessionId,
    createUser,
    findGroup,
    findUser,
    getGroupParticipants,
    getGroupsThatUserIsMember, removeGroupParticipant,
    saveGroupMessage,
    savePrivateMessage
} from "./query";
import {v4 as uuid} from 'uuid'
import bcrypt from "bcrypt";

class ServerService {
    executeCommand({commandName, ...options}, user) {
        switch (commandName) {
            case Constants.Commands.Make:
                return this.#createUser(options);
            case Constants.Commands.Connect:
                return this.#connectUser(options);
            case Constants.Commands.PM:
                return this.#sendPrivateMessage(options, user);
            case Constants.Commands.GM:
                return this.#sendGroupMessage(options, user);
            case Constants.Commands.Users:
                return this.#sendUsers(options, user)
            case  Constants.Commands.GroupList:
                return this.#groupList(user);
            case Constants.Commands.GroupUsersList:
                return this.#userGroupList(options)
            case Constants.Commands.Group:
                return this.#makeGroup(options)
            case Constants.Commands.End:
                return this.#leftGroup(options);
            default:
                throw new Error("Unknown Command")
        }
    }

    #hashPassword = (pass) => {
        const saltRounds = 10;
        return bcrypt.hashSync(pass, saltRounds)
    }


    #userGroupList = ({group}) => {
        return {
            commandName: Constants.Commands.GroupUsersList,
            options: {
                participants: getGroupParticipants(group).join("|")
            }
        }
    }

    ////imp2
    #makeGroup = ({user, gname}) => {
        if (!findGroup(gname)) {
            /// add this user to group participant
            createGroup(gname, gname)
        }
        addGroupParticipant(gname, user)

        return {
            rooms: [gname],
            commandName: Constants.Commands.UserJoint,
            options: {
                user,
                group: gname
            },
            join: gname
        }

    }

    ///imp3
    #leftGroup = ({user, gname}) => {
        if (findGroup(gname)){
            removeGroupParticipant(gname , user)
        }

        return {
            rooms: [gname],
            commandName: Constants.Commands.UserLeave,
            options: {
                user,
                group: gname
            }
        }


    }


    ///imp
    #groupList = (user) => {
        return {
            commandName: Constants.Commands.GroupList,
            options: {
                groups: getGroupsThatUserIsMember(user.ID).join("|")
            }

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

        createUser(id, user, this.#hashPassword(pass));

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

        if (!bcrypt.compareSync(pass, foundUser.Password)) {
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
            rooms: [to, user.ID],
            commandName: Constants.Commands.PM,
            options: {
                from: user.ID,
                to,
                message_len,
                message_body
            },
        }
    }

    //imp group msg
    #sendGroupMessage = ({message_len, to, message_body}, user) => {
        if (message_body.length !== +message_len) {
            throw new Error("Message is corrupted.")
        }

        saveGroupMessage(user.ID, to, message_body, Math.floor(Date.now() / 1000));
        return {
            //group participants
            rooms: [to],
            commandName: Constants.Commands.GM,
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
            //we need all user
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