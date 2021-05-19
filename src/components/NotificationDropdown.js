import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

class NotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu
    }));
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
            className="btn header-item noti-icon waves-effect"
            id="page-header-notifications-dropdown"
            tag="button"
          >
            <i className="mdi mdi-bell-outline"></i>
            <span className="badge badge-danger badge-pill">2</span>
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu-lg p-0" right>
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h5 className="m-0 font-size-16"> Notifications (2) </h5>
                </Col>
              </Row>
            </div>

            <SimpleBar style={{ height: "230px" }}>
              
              <Link to="" className="text-reset notification-item">
                <div className="media">
                  <div className="avatar-xs mr-3">
                    <span className="avatar-title bg-warning rounded-circle font-size-16">
                      <i className="mdi mdi-message-text-outline"></i>
                    </span>
                  </div>
                  <div className="media-body">
                    <h6 className="mt-0 mb-1">Notifications Coming Soon!</h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">Notifications are planned for future releases.</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="" className="text-reset notification-item">
                <div className="media">
                  <div className="avatar-xs mr-3">
                    <span className="avatar-title bg-danger rounded-circle font-size-16">
                      <i className="mdi mdi-message-text-outline"></i>
                    </span>
                  </div>
                  <div className="media-body">
                    <h6 className="mt-0 mb-1">Messages will appear here</h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">To help communication between depts</p>
                    </div>
                  </div>
                </div>
              </Link>
            </SimpleBar>
            <div className="p-2 border-top">
              <Link
                className="btn btn-sm btn-link font-size-14 btn-block text-center"
                to="#"
              >
                {" "}
                View all{" "}
              </Link>
            </div>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}
export default NotificationDropdown;
