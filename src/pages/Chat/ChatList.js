import React, { Component } from 'react';
import { removeQuotes } from '../../assets/js/chatMain';
import '../../assets/css/chat-room.css';

class ChatList extends Component {
    headers = { 
        'Authorization': 'token ' + removeQuotes(sessionStorage.getItem('authUser')),
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
                        <a className="heading-name-meta msg">{removeQuotes(sessionStorage.getItem('authName'))}</a>
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

                <div className="row sideBar msg">
                    {console.log("chats = ", this.props.chats) && this.props.chats.map(chat =>
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
                </div>
            </div>
        );
    }
}

export default ChatList;