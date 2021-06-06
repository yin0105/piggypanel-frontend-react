import React, { Component } from 'react';
import { removeQuotes } from '../../assets/js/chatMain';
import '../../assets/css/chat-room.css';

import $ from 'jquery';
import axios from 'axios';
import { connect } from "react-redux";
import ChatStatusMenu from "./ChatStatusMenu";

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            unreadList: [],
            userStatusList: [],
        };
    }

    headers = { 
        'Authorization': 'token ' + removeQuotes(sessionStorage.getItem('authUser')),
    }

    groups = [
        {"id": "@admin", "username": "@admin", "last_login": "", "unread": 0, "status": "on", },
        {"id": "@agent", "username": "@agent", "last_login": "", "unread": 0, "status": "on", },
    ]

    componentDidMount() {
        axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/users/?user=' + sessionStorage.getItem('authId'), {'headers': this.headers})
            .then(response => {
                const newUsers = response.data //sessionStorage.getItem('access')==="agent"?[...this.groups.slice(0, 1), ...response.data]:[...this.groups, ...response.data];
                this.setState({users: newUsers});
                this.updateUserListWithUnreadList(this.state.unreadList, this.props.userStatusList);
            })
            .catch(error => console.log(error, 1))
    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps = ", nextProps);
        if (nextProps.userStatusList && nextProps.userStatusList.length > 0) {
            this.setState({unreadList: nextProps.unreadList});
            this.setState({userStatusList: nextProps.userStatusList});
            console.log("nextProps.userStatusList = ", nextProps.userStatusList);
            this.updateUserListWithUnreadList(nextProps.unreadList, nextProps.userStatusList);
        }
    }

    componentWillUpdate(nextProps, nextState){
        console.log("== componentWillUpdate");
        // You cannot use this.setState() in this method
    }
    
    // Called IMMEDIATELY AFTER a render
    componentDidUpdate(prevProps, prevState){
        console.log("== componentDidUpdate");
    }

    updateUserListWithUnreadList = (unreadList, userStatusList) => {
        let users = this.state.users;
        let totalUnread = 0;
        for (const i in users) {
            for (const j in unreadList) {
                if (users[i].id == unreadList[j].user) {
                    users[i].unread = unreadList[j].unread;  
                    totalUnread += parseInt(unreadList[j].unread);
                }
            }
        }

        for (const i in users) {
            for (const j in userStatusList) {
                if (users[i].id == userStatusList[j].user) {
                    users[i].status = userStatusList[j].status;  
                }
            }
        }

        this.props.setUnreadCount(totalUnread);
        this.setState({
            users: users,
        });
    }
        
    render() {  
        console.log("this.props.userStatusList = ", this.props.userStatusList);
        
        let { users } = this.state;
        let totalUnread = 0;
        for (const i in users) {
            for (const j in this.props.unreadList) {
                if (users[i].id == this.props.unreadList[j].user) {
                    users[i].unread = this.props.unreadList[j].unread;  
                    totalUnread += parseInt(this.props.unreadList[j].unread);
                }
            }
        }

        for (const i in users) {
            for (const j in this.props.userStatusList) {
                if (users[i].id == this.props.userStatusList[j].user) {
                    users[i].status = this.props.userStatusList[j].status;  
                }
            }
        }

        // this.props.setUnreadCount(totalUnread);
        
        return (
            <div className="side-one msg">
                <div className="row heading msg" style={{ alignItems: 'center' }}>
                    <div className="col-sm-3 col-xs-3 heading-avatar msg">
                        {/* <div className="heading-avatar-icon msg">
                            <img src={require('../../assets/images/avatar/avatar-1.png')}  alt="avatar" className="msg"/> */}
                        <ChatStatusMenu updateUserStatus={userStatusList => this.setState(userStatusList)}/>
                        {/* </div> */}
                    </div>
                    <div className="col-sm-6 col-xs-1 heading-name  msg">
                        <a className="heading-name-meta msg">{removeQuotes(sessionStorage.getItem('username'))}</a>
                    </div>                    
                    <div className="col-sm-2 col-xs-2 heading-compose  pull-right msg">
                        <i className="fa fa-comments fa-2x  pull-right msg" aria-hidden="true" onClick={() => {this.props.updateSideTwoLeft()}}></i>
                    </div>
                    {/* <div className="col-sm-1 col-xs-1  heading-dot  pull-right msg">
                        <a href="/logout" className="msg"><i className="fa fa-ellipsis-v fa-2x  pull-right msg" aria-hidden="true"></i></a>
                    </div> */}
                </div>

                <div className="row searchBox msg">
                    <div className="col-sm-12 searchBox-inner msg">
                        <div className="form-group has-feedback msg">
                            <input id="searchText" type="text" className="form-control msg" name="searchText" placeholder="Search" />
                        </div>
                    </div>
                </div>

                <div className="compose-sideBar msg">
                    { users.map(user => {
                        const badge_style = user.status==="away"? "badge-status-away":(user.status==="off"? "badge-status-off": "");
                        let userStatusStye = { filter: `saturate(100%)` };
                        if (user.status == 'off') {
                            userStatusStye = { filter: `saturate(0%)` };
                        } else if (user.status == 'away') {
                            userStatusStye = { filter: `saturate(100%)` };
                        }
                        return (<div key={user.id} className="row sideBar-body msg" onClick={() => {
                            let data = new URLSearchParams();
                            data.append('receiver', user.id);
                            data.append('sender', sessionStorage.getItem('authId'));
                            this.props.setTransmissible(user.transmissible);
                            axios.post(window.location.protocol + '//' + window.location.hostname + ':8000/create-chat/', data, {'headers': this.headers})
                                .then(response => { 
                                    this.props.updateMainChat(response.data)
                                    this.props.updateUser(user.id)
                                    
                                    axios.get(`${window.location.protocol}//${window.location.hostname}:8000/unread?sender=${user.id}&receiver=${sessionStorage.getItem('authId')}`, {'headers': this.headers})
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
                                    <img src={`${process.env.REACT_APP_API_URL}/media/avatar-2.png`}  alt='avatar' style={ userStatusStye }/>
                                    <span className="badge badge-danger badge-pill" style={{ display: user.unread > 0 ? 'block' : 'none'}}>{user.unread}</span>
                                    <span className={`badge badge-danger badge-pill badge-connect ${badge_style}`}> </span>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main msg">
                                <div className="row msg">
                                    <div className="col-sm-8 col-xs-8 sideBar-name msg">
                                        <span className="name-meta msg">{user.username}</span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time msg">
                                        <span className="time-meta pull-right msg">{user.last_login}</span>
                                    </div>
                                </div>
                            </div>
                        </div>)
                        
                    }
                    )}
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

export default connect(mapStatetoProps, mapDispatchtoProps)(ChatList);  