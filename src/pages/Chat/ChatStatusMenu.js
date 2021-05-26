import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import "../../assets/css/chat-room.css";

class CharStatusMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      status: 'on',
      hideDropdown: true
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu
    }));
  }

  setStatus = status => {
    this.setState({hideDropdown: true, status: status, });
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
            onClick={()=> {this.setState({hideDropdown: false}); console.log(this.state.hideDropdown)}}
          >
            <div className="heading-avatar-icon msg">
                <img src={require('../../assets/images/avatar/avatar-1.png')}  alt="avatar" className="msg"/>
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
export default CharStatusMenu;
