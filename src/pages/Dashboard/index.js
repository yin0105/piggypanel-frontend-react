import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Button, Input, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
// Custom Scrollbar
import SimpleBar from "simplebar-react";

// import images
import servicesIcon1 from "../../assets/images/services-icon/01.png";
import servicesIcon2 from "../../assets/images/services-icon/02.png";
import servicesIcon3 from "../../assets/images/services-icon/03.png";
import servicesIcon4 from "../../assets/images/services-icon/04.png";
import user2 from "../../assets/images/users/user-2.jpg";
import user3 from "../../assets/images/users/user-3.jpg";
import user4 from "../../assets/images/users/user-4.jpg";
import user5 from "../../assets/images/users/user-5.jpg";
import user6 from "../../assets/images/users/user-6.jpg";
import smimg1 from "../../assets/images/small/img-1.jpg";
import smimg2 from "../../assets/images/small/img-2.jpg";

// Charts
import LineAreaChart from "../AllCharts/apex/lineareachart";
import RadialChart from "../AllCharts/apex/apexdonut";
import Apexdonut from "../AllCharts/apex/apexdonut1";
import SparkLine from "../AllCharts/sparkline/sparkline";
import SparkLine1 from "../AllCharts/sparkline/sparkline1";
import Salesdonut from "../AllCharts/apex/salesdonut";

import "chartist/dist/scss/chartist.scss";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Dashboard</h4>
                {/*}
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item active">
                    Welcome to Piggy Panel!
                  </li>
                </ol>
                */}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <h1>Welcome to Pepe's Piggy Panel</h1>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
