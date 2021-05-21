import React, { Component } from 'react';
import $ from 'jquery';
import forge from 'node-forge';
import Message from './Message';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
import { removeQuotes } from '../../assets/js/chatMain';
import '../../assets/css/chat-room.css';


class Chat extends Component {
    constructor(props) {
        super(props);
        console.log("ws = ", 'ws://' + window.location.hostname +':8000/chat/stream/')
        this.state = {
            chat: {
                messages: [],
                id: window.chat
            },
            type: 'rsa',
            socket: new WebSocket('ws://' + window.location.hostname +':8000/chat/stream/'),
            publicKey: new JSEncrypt(),
            opened: false,
        };
    }

    headers = { 
        'Authorization': 'token ' + removeQuotes(sessionStorage.getItem('authUser')),
    }

    componentDidMount() {
        console.log("Chat :: componentDidMount()");
        console.log("token: ", this.headers);
        this.setupWebsocket();
        if (typeof this.messagesDiv !== "undefined") {
            this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("Chat :: componentWillReceiveProps() ", nextProps);
        if (nextProps.chat) {
            this.setState({
                chat: nextProps.chat
            });
            // Log into current chat
            let message = {
                command: 'join',
                chat: nextProps.chat.id,
                user: removeQuotes(sessionStorage.getItem("authId")),
            };
            console.log("=== message = ", message);
            this.state.opened && this.state.socket.send(JSON.stringify(message));
        }

    }

    componentDidUpdate() {
        console.log("Chat :: componentDidUpdate()");
        if (typeof this.messagesDiv !== "undefined") {
            this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        }
    }

    componentWillUnmount() {
        console.log("Chat :: componentWillUnmount()");
        this.state.ws.close();
    }

    setupWebsocket() {
        console.log("Chat :: setupWebsocket()");
        let websocket = this.state.socket;
        try {
            websocket.onopen = () => {
                this.setState({opened: true});
                console.log('::: open')
            };
        } catch (e) {
            console.log("== socket open error: ", e)
        }
    
        websocket.onmessage = (evt) => {
            let data = JSON.parse(evt.data)
            if ('key' in data) {
                console.log("== OnMessage() =>", data)
                this.setState({
                    publicKey: forge.pki.publicKeyFromPem(data.key)
                });
            }
            else if ('message' in data) {
                let conversation = this.state.chat.messages;
                console.log("new message = ", data.message);
                conversation.push(data.message)
                this.setState({messages: conversation});
            }
        };
    
        websocket.onclose = () => {
            console.log('closed')
        }
    }

    rsaEncrypt(text) {
        console.log("Chat :: rsaEncrypt()");
        console.log("publicKey = ", this.state.publicKey);
        let encryptedMessage = this.state.publicKey.encrypt(text, "RSA-OAEP", {
            md: forge.md.sha256.create(),
            mgf1: forge.mgf1.create()
        });
        console.log(encryptedMessage)
        let messageBase64 = forge.util.encode64(encryptedMessage);
        console.log(messageBase64)
        let message = {
            command: 'send',
            chat: this.state.chat.id,
            message: messageBase64,
            user: removeQuotes(sessionStorage.getItem("authId")),
            type: this.state.type
        };
        this.state.opened && this.state.socket.send(JSON.stringify(message));
    }

    aesEncrypt(text) {
        console.log("Chat :: aesEncrypt()");
        var key = CryptoJS.enc.Utf8.parse('1234567890123456');
        var iv = CryptoJS.enc.Utf8.parse('this is a passph');
        
        var encrypted = CryptoJS.AES.encrypt(text, key, {iv: iv});
        let encrypted_text = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
        console.log(encrypted_text); 
        let message = {
            command: 'send',
            chat: this.state.chat.id,
            message: encrypted_text,
            user: sessionStorage.getItem('authId'),
            type: this.state.type
        };
        this.state.opened && this.state.socket.send(JSON.stringify(message));
    }

    render() {
        console.log("Chat :: render()");
        const user = sessionStorage.getItem('authId');
        console.log("== user = ", user);
        const chat = this.props.chat;
        let messages = '';
        if (this.state.chat.id === 0) {
            return <div className="col-sm-8 conversation"></div>
        }
        if (chat) {
            messages = chat.messages.map(message =>{ console.log("#", user, "#", message.sender.id + "#", typeof(user), typeof(message.sender.id)); return <Message 
                key={message.id} 
                classType={message.sender.id != user ? 'receiver' : 'sender'} 
                text={message.text} 
                date_sent={message.diff_time} 
            />});
        }

        return (
            <div className="col-sm-8 conversation msg">
                <div className="row heading msg">
                    <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar msg">
                        <div className="heading-avatar-icon msg">
                            <img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="avatar" className="msg" />
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
                    <div className="col-sm-1 col-xs-1  heading-dot pull-right msg">
                        <i className="fa fa-ellipsis-v fa-2x  pull-right msg" aria-hidden="true"></i>
                    </div>
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
                        console.log(this.state.type);
                    }}>
                        <i className="fa fa-smile-o fa-2x msg"></i>
                    </div>
                    <div className="col-sm-9 col-xs-9 reply-main msg">
                        <textarea className="form-control" rows="1" id="comment" ref={text => { this.messageText = text; }}></textarea>
                    </div>
                    <div className="col-sm-1 col-xs-1 reply-recording">
                        <i className="fa fa-microphone fa-2x msg" aria-hidden="true"></i>
                    </div>
                    <div className="col-sm-1 col-xs-1 reply-send msg" onClick={() => {
                        let type = this.state.type;
                        let text = this.messageText.value;
                        console.log(text);
                        if (type === 'rsa') {
                            this.rsaEncrypt(text);
                        } else {
                            this.aesEncrypt(text);
                        }
                        $('#comment').val('');
                    }}>
                        <i className="fa fa-paper-plane fa-2x msg" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        );
    }
}  

export default Chat;