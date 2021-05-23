

const initialState = {
    opened: false,
    unreadCount: 0
}

const Notification = (state = initialState, action) => {
    console.log("notification: ", state.opened, action.type);
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
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default Notification;