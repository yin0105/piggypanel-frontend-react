

const initialState = {
    opened: false,
    unreadCount: 0,
    unreadList: [],
    userStatusList: [],
    transmissible: false,
}

const Notification = (state = initialState, action) => {
    switch (action.type) {
        case "CHAT_OPEN":
            state = {
                ...state,
                opened: true
            }
            break;      
        case "CHAT_CLOSE":
            state = {
                ...state,
                opened: false
            }
            break;     
        case "CHAT_SET":
            state = {
                ...state,
                opened: !state.opened
            }
            break;   
        case "UNREAD_ADD":
            state = {
                ...state,
                unreadCount: state.unreadCount + 1,
            }
            break;
        case "UNREAD_SET":
            state = {
                ...state,
                unreadCount: action.payload.count,
            }
            break;  
        case "UNREAD_SAVE":
            state = {
                ...state,
                unreadList: action.payload.unreadList,
            }
            break;
        case "USER_STATUS_SAVE":
            state = {
                ...state,
                userStatusList: action.payload.userStatusList,
            }
            break;   
        case "SET_TRANSMISSIBLE":
            state = {
                ...state,
                transmissible: action.payload.transmissible,
            }
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default Notification;