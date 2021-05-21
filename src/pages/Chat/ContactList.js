import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { removeQuotes } from '../../assets/js/chatMain';

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

                <div className="row compose-sideBar msg">
                    { this.state.users.map(user => 
                        <div key={user.id} className="row sideBar-body msg" onClick={() => {
                            let data = new URLSearchParams();
                            data.append('receiver', user.id);
                            data.append('sender', sessionStorage.getItem('authId'));
                            axios.post(window.location.protocol + '//' + window.location.hostname + ':8000/create-chat/', data, {'headers': this.headers})
                                .then(response => {
                                    console.log(response)
                                    this.props.updateMainChat(response.data)
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

export default ContactList;