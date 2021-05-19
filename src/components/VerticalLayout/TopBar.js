import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
  DropdownItem,
  DropdownMenu,
  Dropdown,
  DropdownToggle
} from "reactstrap";

// import images
import logodarkImg from "../../assets/images/logo-dark.png";
import logosmImg from "../../assets/images/logo-sm.png";
import logolightImg from "../../assets/images/logo-light.png";

// Import other Dropdown
import LanguageDropdown from "../../components/LanguageDropdown";
import NotificationDropdown from "../../components/NotificationDropdown";
import ProfileMenu from "../../components/ProfileMenu";

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchOpen: false
    };

    this.toggleRightbar = this.toggleRightbar.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  /**
   * Toggle Search
   */
  toggleSearch() {
    this.setState({ isSearchOpen: !this.state.isSearchOpen });
  }

  /**
   * Toggle sidebar
   */
  toggleMenu() {
    this.props.toggleMenuCallback();
  }

  /**
   * Toggles the sidebar
   */
  toggleRightbar() {
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
              <div className="navbar-brand-box">
                <Link to="/dashboard" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logosmImg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logodarkImg} alt="" height="17" />
                  </span>
                </Link>

                <Link to="/dashboard" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logosmImg} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logolightImg} alt="" height="18" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="d-flex">
              <div className="dropdown d-none d-lg-inline-block">
                <button
                  type="button"
                  className="btn header-item noti-icon waves-effect"
                  onClick={this.toggleFullscreen}
                  data-toggle="fullscreen"
                >
                  <i className="mdi mdi-fullscreen"></i>
                </button>
              </div>

              <ProfileMenu />

              {/* <div className="dropdown d-inline-block">
                <button
                  type="button"
                  onClick={this.toggleRightbar}
                  className="btn header-item noti-icon right-bar-toggle waves-effect"
                >
                  <i className="mdi mdi-settings-outline"></i>
                </button>
              </div> */}
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

export default TopBar;
