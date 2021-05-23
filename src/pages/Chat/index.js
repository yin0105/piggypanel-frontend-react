import React, { Component } from 'react';
import './ChatMain.css';
import Chat from './Chat';
import ChatList from './ChatList';
import ContactList from './ContactList';
import axios from 'axios';
import '../../assets/css/chat-room.css';
import { removeQuotes } from '../../assets/js/chatMain';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
// import '../../assets/js/chatMain.js';
// import '../../assets/css/font-awesome.min.css';

axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";


class ChatMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainChat: null,
      chats: [],
      user: '',
      user_2: '',
      side_two_left: '-100%',
    };    
  }

  headers = { 
    'Authorization': 'token ' + removeQuotes(sessionStorage.getItem('authUser')),
  }

  componentDidMount() {   
    
    console.log("headers = ", this.headers) ;
    axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/chats/', {'headers': this.headers})
      .then(response => {
        console.log("=== response OK", response.data);
        this.setState({
          chats: response.data,
          mainChat: response.data[0]
        })
      })
      .catch(error => console.log(error,4));
    axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/users/' + sessionStorage.getItem('authId') + '/', {'headers': this.headers})
      .then(response => this.setState({
        user: response.data
      }))
      .catch(error => console.log(error,3));
  }
  
  render() {
    // if (!this.props.opened) {
    //   return (
    //     <Redirect to='/dashboard'/>
    //   );
    // } else {
      return <div className="app-one msg m-3"> 
              <div key={1} className="col-sm-4 side msg">
                <ChatList chats={this.state.chats} updateMainChat={chat => this.setState({mainChat: chat})} updateUser={user => this.setState({user_2: user})} className="msg" updateSideTwoLeft={() => this.setState({side_two_left: this.state.side_two_left==="0"?"-100%":"0"})}/>
                <ContactList className="msg" updateMainChat={chat => {
                      this.setState({mainChat: chat})
                      axios.get(window.location.protocol + '//' + window.location.hostname + ':8000/chats/', {'headers': this.headers})
                        .then(response => {
                          console.log("== chats (2) => ",  response.data);
                          this.setState({
                            chats: response.data
                          })
                        })
                        .catch(error => console.log(error,5))
                    }
                  } 
                  side_two_left={ this.state.side_two_left }
                />
              </div>
              <Chat key={2} chat={this.state.mainChat} user={this.state.user_2} className="msg" />,
            </div>
    // }
  }
}


const mapStatetoProps = state => ({
  opened: state.opened,
})


export default connect(mapStatetoProps, null)(ChatMain);
