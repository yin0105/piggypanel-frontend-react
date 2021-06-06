import React, { Component } from "react";
import { Link } from "react-router-dom";

import logodarkImg from "../../assets/images/logo-dark.png";
import logosmImg from "../../assets/images/logo-sm.png";
import logolightImg from "../../assets/images/logo-light.png";

import NotificationDropdown from "../../components/NotificationDropdown";
import ProfileMenu from "../../components/ProfileMenu";
import { connect } from "react-redux";
import forge from 'node-forge';
import JSEncrypt from 'jsencrypt';
import { removeQuotes } from '../../assets/js/chatMain';
import axios from 'axios';


class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: {
          messages: [],
          id: window.chat
      },
      type: 'rsa',
      socket: new WebSocket(('https:'?'wss://':'ws://') + window.location.hostname +`:${process.env.REACT_APP_WEBSOCKET_PORT}/chat/stream/`),      
      publicKey: new JSEncrypt(),
      opened: false,
    };

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleRightbar = this.toggleRightbar.bind(this);
  }

  componentDidMount() {
    this.setupWebsocket();
    this.initUnreadCount();
  }

  componentWillUnmount() {
    console.log("Topbar :: Chat :: componentWillUnmount()");
    this.state.socket.close();
  }

  initUnreadCount = () => {
    axios.get(`${window.location.protocol}//${window.location.hostname}:8000/unread?sender=-1&receiver=${removeQuotes(sessionStorage.getItem("authId"))}`, {'headers': this.headers})
      .then(response => {
          const unreadList = response.data.unread;
          let totalUnread = 0;
          for (const j in unreadList) {
              totalUnread += parseInt(unreadList[j].unread);
          }
          
          this.props.setUnreadCount(totalUnread);
          this.props.saveUnreadCount(unreadList);
          this.props.saveUserStatus(response.data.user_status);
      })
      .catch(error => console.log(error))
  }

  setupWebsocket() {
    console.log("Topbar :: Chat :: setupWebsocket()");
    let websocket = this.state.socket;
    try {
        websocket.onopen = () => {
            this.setState({opened: true});
            console.log('Topbar :: Chat :: open');
            // let message = {
            //     command: 'prejoin',
            //     chat: this.state.chat.id,
            //     group: 'admin',
            //     user: removeQuotes(sessionStorage.getItem("authId")),
            // };
            // this.state.opened && this.state.socket.send(JSON.stringify(message));
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
        // } else if ('prejoin' in data) {
        //     console.log(" == prejoin ");
        }
        else if ('message' in data && data.receiver.indexOf(`_${removeQuotes(sessionStorage.getItem("authId"))}_`) > -1) {
            let sender = data.receiver.split("_")[1];
            console.log("new message = ", data.message);
            console.log("receiver = ", data.receiver);
            console.log("sender = ", sender);
            console.log("user = ", removeQuotes(sessionStorage.getItem("authId")));
            console.log("oppo = ", this.props.user);
            
            // if (this.props.user == sender || removeQuotes(sessionStorage.getItem("authId")) == sender) {
            //     let conversation = this.state.chat.messages;
            //     conversation.push(data.message)
            //     this.setState({messages: conversation});
            // } else {
                
            // }

            if (!this.props.opened) {
              this.initUnreadCount();
            }
        }
    };

    websocket.onclose = () => {
        console.log('closed')
    }
  }

  /**
   * Toggle sidebar
   */
  toggleMenu() {
    // this.props.toggleMenuCallback();
    this.props.openLeftMenuCallBack();
  }

  /**
   * Toggles the sidebar
   */
  toggleRightbar() {
    console.log("OK !");
    this.props.toggleRightSidebar();
  }

  /**
   * Toggle full screen
   */
  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div
                className="navbar-brand-box"
              >

                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logosmImg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logodarkImg} alt="" height="50" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logosmImg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logolightImg} alt="" height="50" />
                  </span>
                </Link>
              </div>

              <button
                type="button"
                className="btn btn-sm mr-2 font-size-24 d-lg-none header-item waves-effect waves-light"
                onClick={this.toggleMenu}
              >
                <i className="mdi mdi-menu"></i>
              </button>
            </div>

            <div className="d-flex">
{/*}
              <form className="app-search d-none d-lg-block">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                  <span className="fa fa-search"></span>
                </div>
              </form>
                  */}

{/*}
              <LanguageDropdown />
              <div className="dropdown d-none d-lg-inline-block">
                <button
                  type="button"
                  className="btn header-item noti-icon waves-effect"
                  onClick={this.toggleFullscreen}
                >
                  <i className="mdi mdi-fullscreen"></i>
                </button>
              </div>
    */}
              {/* <NotificationDropdown /> */}
              <button className="btn header-item noti-icon waves-effect" onClick={() => this.props.openChat()}>
                {/* <Icon icon={messageCircleOutline} /> */}
                {/* <i className="mdi mdi-bell-outline"></i> */}
                <i className="fa fa-comments fa-2x  pull-right msg-outline" aria-hidden="true"></i>
                {/* <MessageCircle/> */}
                <span className="badge badge-danger badge-pill" style={{ display: this.props.unread > 0 ? 'block' : 'none'}}>{this.props.unread}</span>
              </button>

              <ProfileMenu />
{/*}
              <div className="dropdown d-inline-block">
                <button
                  type="button"
                  onClick={this.toggleRightbar}
                  className="btn header-item noti-icon right-bar-toggle waves-effect"
                >
                  <i className="mdi mdi-settings-outline"></i>
                </button>
              </div>
*/}
              <div className="dropdown d-inline-block">
                <button
                  type="button"
                  onClick={this.toggleRightbar}
                  className="btn header-item noti-icon right-bar-toggle waves-effect"
                >
                  <i className="bx bx-cog bx-spin"></i>
                </button>
              </div>
  
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => ({
  unread: state.Notification.unreadCount,
  opened: state.Notification.opened,
})

const mapDispatchtoProps = dispatch => ({
  openChat: () => {
    dispatch({
      type: "CHAT_OPEN"
    })
  },

  addUnreadCount: () => {
    dispatch({
        type: "UNREAD_ADD",
    })
  },

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
})

export default connect(mapStatetoProps, mapDispatchtoProps)(TopBar);
