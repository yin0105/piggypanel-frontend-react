import React, { Component } from 'react';
import $ from 'jquery';
import forge from 'node-forge';
import Message from './Message';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import { removeQuotes } from '../../assets/js/chatMain';
import '../../assets/css/chat-room.css';
import { connect } from "react-redux";
import axios from 'axios';
import { scryRenderedDOMComponentsWithTag } from 'react-dom/test-utils';


class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: {
                messages: [],
                id: window.chat
            },
            type: 'rsa',
            socket: new WebSocket((window.location.protocol=='https:'?'wss://':'ws://') + window.location.hostname +`:${process.env.REACT_APP_PORT}/ws/chat/stream/`),
            publicKey: new JSEncrypt(),
            opened: false,
            trasmissible: false,
            userStatusList: [],
        };
    }

    headers = { 
        'Authorization': 'token ' + removeQuotes(sessionStorage.getItem('authUser')),
    }

    handleChatTextKeyUp = e => {
        if (e.keyCode === 13 && !e.ctrlKey && !e.shiftKey) {
            this.sendChat();
        }
    }

    clearUnreadBadge = e => {
        if (this.props.user) {
            axios.get(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_PORT}/unread?sender=${this.props.user}&receiver=${sessionStorage.getItem("authId")}`, {'headers': this.headers})
                .then(response => {
                    this.props.saveUnreadCount(response.data.unread);
                    this.props.saveUserStatus(response.data.user_status);
                })
                .catch(error => console.log(error))
        }
    }

    componentDidMount() {
        this.props.openChat();
        this.setupWebsocket();        
        if (typeof this.messagesDiv !== "undefined") {
            this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chat) {
            this.setState({
                chat: nextProps.chat
            });
            // Log into current chat
            let message = {
                command: 'join',
                chat: nextProps.chat.id,
                user: sessionStorage.getItem("authId"),
            };
            this.state.opened && this.state.socket.send(JSON.stringify(message));
        }

    }

    componentDidUpdate() {
        if (typeof this.messagesDiv !== "undefined") {
            this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        }
    }

    componentWillUnmount() {
        this.props.closeChat();
    }

    setupWebsocket() {
        let websocket = this.state.socket;
        try {
            websocket.onopen = () => {
                this.setState({opened: true});
                // let message = {
                //     command: 'prejoin',
                //     chat: this.state.chat.id,
                //     group: 'admin',
                //     user: sessionStorage.getItem("authId"),
                // };
                // this.state.opened && this.state.socket.send(JSON.stringify(message));
            };
        } catch (e) {
            console.log("== socket open error: ", e)
        }
    
        websocket.onmessage = (evt) => {
            let data = JSON.parse(evt.data)
            if ('key' in data) {
                this.setState({
                    publicKey: forge.pki.publicKeyFromPem(data.key)
                });

            } else if ('message' in data && data.receiver.indexOf(`_${sessionStorage.getItem("authId")}_`) > -1) {
                let sender = data.receiver.split("_")[1];
                let read_sender = -1;
                const receiver = sessionStorage.getItem("authId");
                if (this.props.user == sender || sessionStorage.getItem("authId") == sender) {
                    let chat = this.state.chat;
                    let conversation = chat.messages;
                    conversation.push(data.message);
                    chat.messages = conversation;
                    // this.setState({chat: chat});
                    
                    // if (this.props.user == sender) {
                    //     read_sender = sender;
                    // }
                }

                axios.get(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_PORT}/unread?sender=${read_sender}&receiver=${receiver}`, {'headers': this.headers})
                    .then(response => {
                        this.props.saveUnreadCount(response.data.unread);
                        this.props.saveUserStatus(response.data.user_status);
                    })
                    .catch(error => console.log(error))
            }
        };
    
        websocket.onclose = () => {
            console.log('closed')
        }
    }

    rsaEncrypt(text) {
        // let encryptedMessage = this.state.publicKey.encrypt(text, "RSA-OAEP", {
        //     md: forge.md.sha256.create(),
        //     mgf1: forge.mgf1.create()
        // });
        // let messageBase64 = forge.util.encode64(encryptedMessage);
        let message = {
            command: 'send',
            chat: this.state.chat.id,
            message: text,
            // message: messageBase64,
            user: sessionStorage.getItem("authId"),
            type: this.state.type
        };
        this.state.opened && this.state.socket.send(JSON.stringify(message));
    }

    aesEncrypt(text) {
        var key = CryptoJS.enc.Utf8.parse('1234567890123456');
        var iv = CryptoJS.enc.Utf8.parse('this is a passph');
        
        var encrypted = CryptoJS.AES.encrypt(text, key, {iv: iv});
        let encrypted_text = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
        let message = {
            command: 'send',
            chat: this.state.chat.id,
            message: encrypted_text,
            user: sessionStorage.getItem('authId'),
            type: this.state.type
        };
        this.state.opened && this.state.socket.send(JSON.stringify(message));
    }

    sendChat = () => {
        let type = this.state.type;
        let text = this.messageText.value;
        if (type === 'rsa') {
            this.rsaEncrypt(text);
        } else {
            this.aesEncrypt(text);
        }
        $('#comment').val('');
    }

    render() {
        const user = sessionStorage.getItem('authId');
        const chat = this.props.chat;
        let messages = '';
        if (this.state.chat.id === 0) {
            return <div className="col-sm-8 conversation"></div>
        }
        if (chat) {
            messages = chat.messages.map(message =>{ 
                let diff_time = "";
                if (message.date_sent != null) {
                    const diff_time_int = Math.floor((new Date().getTime() - Date.parse(message.date_sent)) / 1000);
                    if (diff_time_int < 1) {
                        diff_time = "just now";
                    } else if (diff_time_int < 60) {
                        diff_time = diff_time_int + " seconds ago";
                    } else if (diff_time_int < 3600) {
                        diff_time = Math.floor(diff_time_int / 60) + " minutes ago";
                    } else if (diff_time_int < 86400) {
                        diff_time = Math.floor(diff_time_int / 3600) + " hours ago";
                    } else if (diff_time_int < 86400 * 30) {
                        diff_time = Math.floor(diff_time_int / 86400) + " days ago";
                    } else if (diff_time_int < 86400 * 365) {
                        diff_time = Math.floor(diff_time_int / (86400 * 30)) + " months ago";
                    } else {
                        diff_time = Math.floor(diff_time_int / (86400 * 365)) + " years ago";
                    }
                }
                return <Message 
                key={message.id} 
                classType={message.sender.id != user ? 'receiver' : 'sender'} 
                text={message.text} 
                date_sent={diff_time} 
            />});
        }

        return (
            
            <div className="col-sm-8 conversation msg">
                <div className="row heading msg">
                    <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar msg">
                        <div className="heading-avatar-icon msg">
                            <img src={`${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_PORT}/static/img/avatar-2.png`} alt="avatar" className="msg" />
                        </div>
                    </div>
                    <div className="col-sm-8 col-xs-7 heading-name msg">
                        <a className="heading-name-meta msg">
                            <span className="name-meta msg">
                                {!chat ? '' : chat.users[0].id != sessionStorage.getItem('authId') ? chat.users[0].username : chat.users[1].username }
                            </span>
                        </a>
                        <span className="heading-online msg">Online</span>
                    </div>
                    {/* <div className="col-sm-1 col-xs-1  heading-dot pull-right msg">
                        <i className="fa fa-ellipsis-v fa-2x  pull-right msg" aria-hidden="true"></i>
                    </div> */}
                </div>
                <div className="message msg" id="conversation" ref={messages => {this.messagesDiv = messages;}}>
                    <br />
                    {messages}
                </div>

                <div className="row reply msg">
                    <div className="col-sm-1 col-xs-1 reply-emojis msg" onClick={() => {
                        if (this.state.type === 'rsa') {
                            this.setState({type: 'aes'});
                        } else {
                            this.setState({type: 'rsa'});
                        }
                    }}>
                        <i className="fa fa-smile-o fa-2x msg"></i>
                    </div>
                    <div className="col-sm-9 col-xs-9 reply-main msg">
                        <textarea className="form-control" rows="1" id="comment" ref={text => { this.messageText = text; }} readOnly={ !this.props.transmissible }  onKeyUp={this.handleChatTextKeyUp} onClick={this.clearUnreadBadge} onChange={this.clearUnreadBadge}></textarea>
                    </div>
                    <div className="col-sm-1 col-xs-1 reply-send msg" onClick={() => {
                        this.sendChat();
                    }}>
                        <i className="fa fa-paper-plane fa-2x msg" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        );
    }
}  

const mapStatetoProps = state => ({
    unreadList: state.Notification.unreadList,
    transmissible: state.Notification.transmissible,
    userStatusList: state.Notification.userStatusList,
})

const mapDispatchtoProps = dispatch => ({
    openChat: () => {
        dispatch({
            type: "CHAT_OPEN"
        })
    },

    // addUnreadCount: () => {
    //     dispatch({
    //         type: "UNREAD_ADD",
    //     })
    // },

    closeChat: () => {
      dispatch({
        type: "CHAT_CLOSE"
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
})

export default connect(mapStatetoProps, mapDispatchtoProps)(Chat);  
