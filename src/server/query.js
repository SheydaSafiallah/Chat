import db from "./db";

export const findUser = (id) => {
    return db.prepare('select * from Authentication where ID=?').get(id)
}

export const createUser = (id, userName, password) => {
    return db.prepare('insert into Authentication (ID,UserName,Password) values (?,?,?)').run(id, userName, password)
}

export const createSessionId = (sessionId, userId) => {
    return db.prepare('insert into Session (ID,UserID) values (?,?)').run(sessionId, userId)
}

export const findUserBySessionId = (sessionId) => {
    const session = db.prepare('select * from Session where ID=?').get(sessionId)
    return session && findUser(session.UserID)
}

export const savePrivateMessage = (senderId, receiverId, message, time) => {
    return db.prepare('insert into PrivateChat (SenderID,ReceiverID,Message,Time) values (?,?,?,?)').run(senderId, receiverId, message, time)
}


export const saveGroupMessage = (senderId, receiverId, message, time) => {
    return db.prepare('insert into GroupMessage (SenderID,GroupID,Message,Time) values (?,?,?,?)').run(senderId, receiverId, message, time)
}


export const getGroupParticipants = (groupId) => {
    return db.prepare('select Participant from GroupParticipant where GroupID=?').all(groupId).map(
        ({Participant})=>Participant
    )
}

export const getGroupID = () =>{
    return db.prepare('select GroupID from GROUP')
}

export const getGroupsThatUserIsMember=(userName) =>{
    return db.prepare('select GroupID from GroupParticipant where Participant =?').all(userName).map(
        ({GroupID})=>GroupID
    )
}


export const createGroup = (groupID, groupName) => {
    return db.prepare('insert into "Group" (GroupID,GroupName) values (?,?)').run(groupID, groupName)
}


export const addGroupParticipant = (groupID, participant) => {
    return db.prepare('insert into GroupParticipant (GroupID,Participant) values (?,?)').run(groupID, participant)
}

// imp3
export const removeGroupParticipant = (groupID, participant) => {
    return db.prepare('delete from GroupParticipant where Participant = ?').run(participant)
    // return db.prepare()
}
//
// export const restoreMessage = () =>{
//
// }



export const findGroup = (GroupID) => {
    return db.prepare('select * from "Group" where GroupID = ?').get(GroupID)
}


export const allUsers = ()=>{
    return db.prepare('select ID from Authentication').all().map(
        ({ID})=>ID
    );
}