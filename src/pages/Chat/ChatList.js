import React, { Component } from 'react';
import { removeQuotes } from '../../assets/js/chatMain';
import '../../assets/css/chat-room.css';

import $ from 'jquery';
import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

class ChatList extends Component {
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
        console.log("protocol = ", window.location.protocol);
        axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/users', {'headers': this.headers})
            .then(response => {
                console.log("Contact List (Users) = ", response);
                this.setState({users: response.data});
            })
            .catch(error => console.log(error, 1))
    }
        
    render() {
        return (
            <div className="side-one msg">
                <div className="row heading msg">
                    <div className="col-sm-3 col-xs-3 heading-avatar msg">
                        <div className="heading-avatar-icon msg">
                            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" className="msg" />
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

export default ChatList;