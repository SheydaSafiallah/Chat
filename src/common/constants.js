const Constants = {
    hostname: 'localhost',
    port: 50000,
    Commands: {
        Make: 'Make',
        Connect: 'Connect',
        Connected: 'Connected',
        Error: 'ERROR',
        UserAccepted: 'User Accepted',
        UserNotAccepted: 'User Not Accepted',
        PM: 'PM',
        GM: 'GM',
        Users: 'Users',
        UsersList: 'USERS_LIST',
        GroupUsersList: 'GROUP_USERS_LIST',
        GroupList: 'Group_List',
        Group: 'Group', //make or join
        End: 'End', //leave
        UserJoint: 'UserJoint',
        UserLeave: 'UserLeave'
    },
    LocalStorage: {
        Session: 'session',
        UserID: 'userId'
    }
}


export default Constants;