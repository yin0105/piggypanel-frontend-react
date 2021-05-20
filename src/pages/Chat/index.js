import React, { Component } from 'react';
import './ChatMain.css';
import Chat from './Chat';
import ChatList from './ChatList';
import ContactList from './ContactList';
import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";


class ChatMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainChat: null,
      chats: [],
      user: ''
    };
  }

  componentDidMount() {    
    console.log("== user id = ", sessionStorage.getItem('authId'));
    console.log("== authName = ", sessionStorage.getItem('username'));
    axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/chats?user_id=' + sessionStorage.getItem('authId'))
      .then(response => {
        console.log("=== response OK", response.data);
        this.setState({
          chats: response.data,
          mainChat: response.data[0]
        })
      })
      .catch(error => console.log(error,4));
    axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/users/?user_id=' + sessionStorage.getItem('authId'))
      .then(response => this.setState({
        user: response.data
      }))
      .catch(error => console.log(error,3));
  }
  
  render() {
    return [
      <div key={1} className="col-sm-4 side">
        <ChatList chats={this.state.chats} updateMainChat={chat => this.setState({mainChat: chat})}/>
        <ContactList updateMainChat={chat => {
              this.setState({mainChat: chat})
              axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/chats?user_id=' + sessionStorage.getItem('authId'))
                .then(response => {
                  console.log("== 1");
                  this.setState({
                  chats: response.data
                })
                })
                .catch(error => console.log(error,5))
            }
          } 
        />
      </div>,
      <Chat key={2} chat={this.state.mainChat} />,
    ];
  }
}

export default ChatMain;
