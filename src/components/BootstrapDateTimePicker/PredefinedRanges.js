import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';

import {
  Button,
} from 'react-bootstrap';
//import { Search } from 'react-bootstrap-table2-toolkit';

class PredefinedRanges extends React.Component {

  constructor(props) {
    super(props);

    this.handleEvent = this.handleEvent.bind(this);

    this.state = {
      startDate: (this.props.startDate ? moment(this.props.startDate) : moment().subtract(29, 'days')),
      endDate: (this.props.endDate ? moment(this.props.endDate) : moment()),
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      },
    };
  }

  handleEvent(event, picker) {
    if(!picker){
      let picker = {}
      picker.startDate = this.state.startDate;
      picker.endDate = this.state.endDate;
    } else {
      this.setState({
        startDate: picker.startDate,
        endDate: picker.endDate,
      });
    }
    if(this.props.setDateRange && event.type === "apply"){

      this.props.setDateRange(this.props, picker.startDate, picker.endDate)
      
      let searchArr = {};
      searchArr['datetimerange'] = {}
      searchArr['datetimerange']['startDate'] = moment(picker.startDate).format('YYYY-MM-DD hh:mm:ss');
      searchArr['datetimerange']['endDate'] = moment(picker.endDate).format('YYYY-MM-DD hh:mm:ss');     
      
      this.props.onSearch(JSON.stringify( searchArr ));
    }
    
  }

  render() {
    let start = this.state.startDate.format('MMMM D, YYYY');
    let end = this.state.endDate.format('MMMM D, YYYY');
    let label = start + ' - ' + end;
    if (start === end) {
      label = start;
    }

    let buttonStyle = { width: '100%' };
    
    return (
      <div className="form-group">
        <label className="control-label col-md-3">Search by Dates</label>
        <div className="col-md-4">
          <DatetimeRangePicker
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            ranges={this.state.ranges}
            onEvent={this.handleEvent}
          >
            <Button className="selected-date-range-btn" style={buttonStyle}>
              <div className="float-left">
                <i className="fa fa-calendar"/>
                &nbsp;
                <span>
                  {label}
                </span>
              </div>
              <div className="float-right">
                <i className="fa fa-angle-down"/>
              </div>
            </Button>
          </DatetimeRangePicker>
        </div>
      </div>
    );
  }

}

export default PredefinedRanges;