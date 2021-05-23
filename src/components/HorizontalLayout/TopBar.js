import React, { Component } from "react";
import { Link } from "react-router-dom";

// import images
import logodarkImg from "../../assets/images/logo-dark.png";
import logosmImg from "../../assets/images/logo-sm.png";
import logolightImg from "../../assets/images/logo-light.png";

// Import other Dropdown
import LanguageDropdown from "../../components/LanguageDropdown";
import NotificationDropdown from "../../components/NotificationDropdown";
import ProfileMenu from "../../components/ProfileMenu";
import { Button } from "reactstrap";
import { connect } from "react-redux";

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleRightbar = this.toggleRightbar.bind(this);
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
              <button className="btn header-item noti-icon waves-effect" onClick={() => this.props.clickNotification()}>
                <i className="mdi mdi-bell-outline"></i>
                <span className="badge badge-danger badge-pill">2</span>
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

})

const mapDispatchtoProps = dispatch => ({
  openNotification: () => {
    dispatch({
      type: "CHAT_OPEN"
    })
  },
  closeNotification: () => {
    dispatch({
      type: "CHAT_CLOSE"
    })
  },
  clickNotification: () => {
    console.log("clicked");
    dispatch({
      type: "CHAT_SET"
    })
  },
})

export default connect(mapStatetoProps, mapDispatchtoProps)(TopBar);
