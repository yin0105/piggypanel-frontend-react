import React, { Component } from 'react';
import { removeQuotes } from '../../assets/js/chatMain';
import '../../assets/css/chat-room.css';

import $ from 'jquery';
import axios from 'axios';
import { connect } from "react-redux";

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            unreadList: [],
        };
    }

    headers = { 
        'Authorization': 'token ' + removeQuotes(sessionStorage.getItem('authUser')),
    }

    groups = [
        {"id": "@admin", "username": "@admin", "last_login": "", "unread": 0,},
        {"id": "@agent", "username": "@agent", "last_login": "", "unread": 0,},
    ]

    componentDidMount() {
        axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/users', {'headers': this.headers})
            .then(response => {
                console.log(" group = ", sessionStorage.getItem('access'));
                const newUsers = sessionStorage.getItem('access')==="agent"?[...this.groups.slice(0, 1), ...response.data]:[...this.groups, ...response.data];
                console.log("Contact List (Users) = ", response.data);
                console.log("groups = ", this.groups);
                console.log("Contact List (Users) = ", newUsers);

                this.setState({users: newUsers});
                console.log(":: DidMount() ", this.state.unreadList);
                this.updateUserListWithUnreadList(this.state.unreadList);
            })
            .catch(error => console.log(error, 1))
    }

    componentWillReceiveProps(nextProps) {
        console.log("ChatList :: componentWillReceiveProps() ", nextProps);
        console.log("nextProps.userUnread.length = ", nextProps.unreadList);
        // if (nextProps.userUnread && nextProps.userUnread.length > 0) {
        //     const unreadList = nextProps.userUnread[0];
        //     this.props.saveUnreadCount(unreadList);            
        //     this.updateUserListWithUnreadList(unreadList);
        // } else 
        if (nextProps.unreadList && nextProps.unreadList.length > 0) {
            this.setState({unreadList: nextProps.unreadList});
            this.updateUserListWithUnreadList(nextProps.unreadList);
        }

        

    }

    updateUserListWithUnreadList = unreadList => {
        console.log(":: updateUserListWithUnreadList :: ", this.state.users.length);
        let users = this.state.users;
        let totalUnread = 0;
        for (const i in users) {
            for (const j in unreadList) {
                console.log("users[i].id , unreadList[j].user = ", users[i].id, unreadList[j].user);
                if (users[i].id == unreadList[j].user) {
                    users[i].unread = unreadList[j].unread;  
                    totalUnread += parseInt(unreadList[j].unread);
                }
            }
        }

        this.props.setUnreadCount(totalUnread);
        this.setState({
            users: users,
        });
    }
        
    render() {
        
        return (
            <div className="side-one msg">
                <div className="row heading msg">
                    <div className="col-sm-3 col-xs-3 heading-avatar msg">
                        <div className="heading-avatar-icon msg">
                            <img src={require('../../assets/images/avatar/avatar-1.png')}  alt="avatar" className="msg"/>
                        </div>
                    </div>
                    <div className="col-sm-4 col-xs-1 heading-name  msg">
                        <a className="heading-name-meta msg">{removeQuotes(sessionStorage.getItem('username'))}</a>
                    </div>                    
                    <div className="col-sm-2 col-xs-2 heading-compose  pull-right msg">
                        <i className="fa fa-comments fa-2x  pull-right msg" aria-hidden="true" onClick={() => {console.log("fa-content");this.props.updateSideTwoLeft()}}></i>
                    </div>
                    <div className="col-sm-1 col-xs-1  heading-dot  pull-right msg">
                        <a href="/logout" className="msg"><i className="fa fa-ellipsis-v fa-2x  pull-right msg" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div className="row searchBox msg">
                    <div className="col-sm-12 searchBox-inner msg">
                        <div className="form-group has-feedback msg">
                            <input id="searchText" type="text" className="form-control msg" name="searchText" placeholder="Search" />
                        </div>
                    </div>
                </div>

                {/* <div className="sideBar msg">
                    {this.props.chats.map(chat =>
                        <div key={chat.id} className="row sideBar-body msg" onClick={() => this.props.updateMainChat(chat)}>
                            <div className="col-sm-3 col-xs-3 sideBar-avatar msg">
                                <div className="avatar-icon msg">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" className="msg" alt='receiver user img'/>
                                </div>
                            </div>
                            <div className="col-sm-9 col-xs-9 sideBar-main msg">
                                <div className="row msg">
                                    <div className="col-sm-8 col-xs-8 sideBar-name msg">
                                        <span className="name-meta msg">{chat.users[0].id != sessionStorage.getItem('authId') ? chat.users[0].username : chat.users[1].username }
                                        </span>
                                    </div>
                                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time msg">
                                        <span className="time-meta pull-right msg">{
                                            chat.messages[0] ? chat.messages[0].date_sent : ''
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div> */}

                <div className="compose-sideBar msg">
                    { this.state.users.map(user => 
                        <div key={user.id} className="row sideBar-body msg" onClick={() => {
                            let data = new URLSearchParams();
                            data.append('receiver', user.id);
                            data.append('sender', sessionStorage.getItem('authId'));
                            axios.post(window.location.protocol + '//' + window.location.hostname + ':8000/create-chat/', data, {'headers': this.headers})
                                .then(response => { 
                                    console.log(response)
                                    this.props.updateMainChat(response.data)
                                    this.props.updateUser(user.id)
                                    
                                    console.log("sender_2 = ", user.id, " recevier_s = ", sessionStorage.getItem('authId'));
                                    axios.get(`${window.location.protocol}//${window.location.hostname}:8000/unread?sender=${user.id}&receiver=${sessionStorage.getItem('authId')}`, {'headers': this.headers})
                                        .then(response_2 => {
                                            console.log("response_2 = ", response_2.data.data);
                                            this.props.saveUnreadCount(response_2.data.data);
                                            // this.updateUserListWithUnreadList(response_2.data.data);
                                            // console.log("== Unread => ",  response.data.data);
                                            // this.props.updateUserUnread(response.data.data, new Date());
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
                                    <img src={require('../../assets/images/avatar/avatar-2.png')}  alt='avatar' style={{ filter: `saturate(0%)` }}/>
                                    <span className="badge badge-danger badge-pill" style={{ display: user.unread > 0 ? 'block' : 'none'}}>{user.unread}</span>
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
                        </div>
                    )}
                </div>
            </div>
        );
    }
}


const mapStatetoProps = state => ({
    unread: state.Notification.unreadCount,
    unreadList: state.Notification.unreadList,
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
})

export default connect(mapStatetoProps, mapDispatchtoProps)(ChatList);  