import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { removeQuotes } from '../../assets/js/chatMain';
import '../../assets/css/chat-room.css';
import { connect } from "react-redux";

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

class ContactList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    headers = { 
        'Authorization': 'token ' + removeQuotes(sessionStorage.getItem('authUser')),
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_PORT}/users/?user=${sessionStorage.getItem('authId')}`, {'headers': this.headers})
            .then(response => {
                this.setState({users: response.data});
            })
            .catch(error => console.log(error, 1))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.senderId > -1) {
            if (this.props.senderId == nextProps.senderId ) return;
            this.state.users.map(user => {
                if (user.id == nextProps.senderId) {
                    this.props.updateNewUser(user);
                    console.log("updateNewUser");
                    return
                }
            })
            // this.setState({unreadList: nextProps.unreadList});
            // this.setState({userStatusList: nextProps.userStatusList});
            // this.updateUserListWithUnreadList(nextProps.unreadList, nextProps.userStatusList);
        }

        if (nextProps.selectedUser !== undefined && nextProps.selectedUser !== null) {
            console.log("Not null");
            var is_exist = false;
            this.state.users.map(user => {
                if (is_exist) {return;}
                if (user.id == nextProps.selectedUser.id) {
                    is_exist = true;
                    return;
                }
            })
            if (!is_exist) {
                this.setState({users: [...this.state.users, nextProps.selectedUser]})
                console.log("new user list : ", this.state)
            }
        }
    }

    render() {
        return (
            <div className="side-two msg" style={{ left: this.props.side_two_left, top: '0', position: 'absolute'}}>
                <div className="row newMessage-heading msg">
                    <div className="row newMessage-main msg">
                        <div className="col-sm-2 col-xs-2 newMessage-back msg">
                            <i className="fa fa-arrow-left msg" aria-hidden="true" onClick={() => {
                                $(".side-two").css({
                                    "left": "-100%"
                                });
                            }}></i>
                        </div>
                        <div className="col-sm-10 col-xs-10 newMessage-title msg">
                            New Chat
                        </div>
                    </div>
                </div>

                <div className="row composeBox msg">
                    <div className="col-sm-12 composeBox-inner msg">
                        <div className="form-group has-feedback msg">
                            <input id="composeText" type="text" className="form-control" name="searchText" placeholder="Search People" />
                        </div>
                    </div>
                </div>

                <div className="compose-sideBar msg">
                    { this.state.users.map(user => 
                    {   console.log("contact user: ", user.id, ", trans : ", user.transmissible);
                        return <div key={user.id} className="row sideBar-body msg" onClick={() => {
                            let data = new URLSearchParams();
                            data.append('receiver', user.id);
                            data.append('sender', sessionStorage.getItem('authId'));
                            this.props.setTransmissible(user.transmissible);
                            axios.post(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_PORT}/create-chat/`, data, {'headers': this.headers})
                                .then(response => {
                                    this.props.updateMainChat(response.data, user);
                                    this.props.updateUser(user.id)
                                    
                                    axios.get(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_PORT}/unread?sender=${user.id}&receiver=${sessionStorage.getItem('authId')}`, {'headers': this.headers})
                                        .then(response_2 => {
                                            this.props.saveUnreadCount(response_2.data.unread);
                                            this.props.saveUserStatus(response_2.data.user_status);
                                        })
                                        .catch(error => console.log(error))
                                })
                                .catch(error => console.log(error, 2));
                            
                            $(".side-two").css({
                                "left": "-100%"
                            });
                        }}>
                            <div className="col-sm-3 col-xs-3 sideBar-avatar msg">
                                <div className="avatar-icon msg">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt='avatar' />
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main msg">
                                <div className="row msg">
                                    <div className="col-sm-8 col-xs-8 sideBar-name msg">
                                        <span className="name-meta msg">{user.first_name} { user.last_name }</span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time msg">
                                        <span className="time-meta pull-right msg">{user.last_login}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        );
    }
}

const mapStatetoProps = state => ({
    unread: state.Notification.unreadCount,
    unreadList: state.Notification.unreadList,
    userStatusList: state.Notification.userStatusList,
    // users: () => {
    //     let users = this.state.users;
    //     let totalUnread = 0;
    //     for (const i in users) {
    //         for (const j in state.Notification.unreadList) {
    //             if (users[i].id == state.Notification.unreadList[j].user) {
    //                 users[i].unread = state.Notification.unreadList[j].unread;  
    //                 totalUnread += parseInt(state.Notification.unreadList[j].unread);
    //             }
    //         }
    //     }

    //     for (const i in users) {
    //         for (const j in state.Notification.userStatusList) {
    //             if (users[i].id == state.Notification.userStatusList[j].user) {
    //                 users[i].status = state.Notification.userStatusList[j].status;  
    //             }
    //         }
    //     }
    //     console.log(" == users = ", users);

    //     return users
    //     // this.props.setUnreadCount(totalUnread);
    //     // this.setState({
    //     //     users: users,
    //     // });
    // }
})

const mapDispatchtoProps = dispatch => ({
    setUnreadCount: (count) => {
        dispatch({
            type: "UNREAD_SET",
            payload: {
                count: count,
            }
        })
    },
    
    saveUnreadCount: (unreadList) => {
        dispatch({
            type: "UNREAD_SAVE",
            payload: {
                unreadList: unreadList,
            }
        })
    },

    saveUserStatus: (userStatusList) => {
        dispatch({
            type: "USER_STATUS_SAVE",
            payload: {
                userStatusList: userStatusList,
            }
        })
    },

    setTransmissible: (transmissible) => {
        dispatch({
            type: "SET_TRANSMISSIBLE",
            payload: {
                transmissible: transmissible,
            }
        })
    },
})

export default connect(mapStatetoProps, mapDispatchtoProps)(ContactList);  
