import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import "../../assets/css/chat-room.css";
import { removeQuotes } from '../../assets/js/chatMain';
import { connect } from "react-redux";

import avatarImg1 from "../../assets/images/avatar/avatar-1.png";

class CharStatusMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      status: 'on',
      hideDropdown: true,
      socket: new WebSocket((window.location.protocol=='https:'?'wss://':'ws://') + window.location.hostname +`:${process.env.REACT_APP_PORT}/ws/chat/stream/`),
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.setupWebsocket();
  }

  setupWebsocket() {
    let websocket = this.state.socket;
    try {
        websocket.onopen = () => {
            this.setState({opened: true});
        };
    } catch (e) {
        console.log("== socket open error: ", e)
    }

    websocket.onmessage = (evt) => {
      let data = JSON.parse(evt.data)
      if ('user_status' in data) {
          let userStatusList = this.props.userStatusList;
          let updated = false;

          for (let i in userStatusList) {
              if (userStatusList[i].user == data.user) {
                  userStatusList[i].status = data.user_status;
                  updated = true;
                  break;
              }
          }

          if (!updated) {
              userStatusList.append(data);
          }
          this.props.saveUserStatus(userStatusList);
          this.setState(userStatusList);
          this.props.updateUserStatus(userStatusList);
      }
    };

    websocket.onclose = () => {
        console.log('closed')
    }
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu
    }));
  }

  setStatus = status => {
    this.setState({hideDropdown: true, status: status, });
    let message = {
      command: 'client_status',
      user: removeQuotes(sessionStorage.getItem("authId")),
      status: status,
    };
    this.state.socket.send(JSON.stringify(message));
  }

  render() {
    return (
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="dropdown d-inline-block"
          tag="li"
        >
          <DropdownToggle
            className="btn header-item waves-effect"
            id="page-header-notifications-dropdown"
            tag="button"
            style={{ height: 'auto', padding: '0px' }}
            onClick={()=> {this.setState({hideDropdown: false});}}
          >
            <div className="heading-avatar-icon msg">
                <img src={avatarImg1}  alt="avatar" className="msg"/>
                <span className={`badge badge-danger badge-pill badge-me ${this.state.status==="away"? "badge-status-away":""}`}> </span>
            </div>
          </DropdownToggle>

          <DropdownMenu className={`dropdown-menu-lg p-0 my ${this.state.hideDropdown?"dropdown-hide":"dropdown-show"}`}>
              <div>
                <Link to="#" onClick={() => this.setStatus('on')}>
                  Active
                </Link>
              </div>
              <div>
                <Link to="#" onClick={() => this.setStatus('away')}>
                  Away
                </Link>
              </div>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => ({
  userStatusList: state.Notification.userStatusList,
})

const mapDispatchtoProps = dispatch => ({
  saveUserStatus: (userStatusList) => {
      dispatch({
          type: "USER_STATUS_SAVE",
          payload: {
              userStatusList: userStatusList,
          }
      })
  },
})

export default connect(mapStatetoProps, mapDispatchtoProps)(CharStatusMenu); 
