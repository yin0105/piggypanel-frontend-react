import React, { Component } from "react";
import SettingMenu from "../Shared/SettingMenu";
import { Row, Col, Card, CardBody } from "reactstrap";
// Custom Scrollbar
// import { Link } from "react-router-dom";

// import charts
import BarChart from "../AllCharts/chartist/barchart";
import StackBarChart from "../AllCharts/chartist/stackedbarchart";
import DountChart from "../AllCharts/chartist/dountchart";
import PieChart from "../AllCharts/chartist/piechart";
import SmilAnimationsChart from "../AllCharts/chartist/smilanimations";
import LineChart from "../AllCharts/chartist/linechart";
import ChartBar from "../AllCharts/chartist/chartbar";
import LineAreaChart from "../AllCharts/chartist/lineareachart";

import "chartist/dist/scss/chartist.scss";

class ChartistChart extends Component {
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
                <h4 className="font-size-18">Chartist Chart</h4>
                {/*}
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/#">Charts</Link>
                  </li>
                  <li className="breadcrumb-item active">Chartist Chart</li>
                </ol>
                */}
              </div>
            </Col>

            <Col sm="6">
              <div className="float-right d-none d-md-block">
                <SettingMenu />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">
                    Overlapping bars on mobile
                  </h4>
                  <img src="https://crm.zoho.eu/crm/specific/ViewChartImage?width=400&height=500&embedDetails=fd8494717b2ff01ebebafce6d490d455b46231d0dee3dda78a9e6567b007b13fb509146af411d4a4df99968c505978c91cce9c4dddf7e277165ab9f359fdc1e3b55396651fb01a09a1192704b376c95810fc1d40aa2a0f69a306a367ab1dfc72e984486ae065fcb8af0d861b3fb617b7" />
                  <img src="https://crm.zoho.eu/crm/specific/ViewChartImage?width=1000&height=500&embedDetails=fd8494717b2ff01ebebafce6d490d455b46231d0dee3dda78a9e6567b007b13fda0bb3ccbd70338e90babe8965c95cc11cce9c4dddf7e277165ab9f359fdc1e3b55396651fb01a09a1192704b376c95810fc1d40aa2a0f69a306a367ab1dfc72e984486ae065fcb8af0d861b3fb617b7" />
                  <Row className="justify-content-center">
                    <Col sm={4}>
                                          <div className="text-center">
                        <h5 className="mb-0 font-size-20">86541</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">2541</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">102030</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>
                  <BarChart />
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Stacked bar chart</h4>

                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">5241</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">65411</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">51654</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <StackBarChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">
                    Animating a Donut with Svg.animate
                  </h4>

                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">748949</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">5181</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">101025</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <DountChart />
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Simple pie chart</h4>

                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">48484</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">48652</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">85412</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <PieChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Advanced Smil Animations</h4>

                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">45410</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">4442</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">3201</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <SmilAnimationsChart />
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Simple line chart</h4>

                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">44242</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">75221</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">65212</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <LineChart />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Bar Diagram</h4>

                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">5677</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">5542</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">12422</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <ChartBar />
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Line chart with area</h4>

                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">4234</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">64521</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">94521</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>
                  <LineAreaChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default ChartistChart;
