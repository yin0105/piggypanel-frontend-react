import React, { Component } from "react";
//import SettingMenu from "../../Shared/SettingMenu";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import RemoteDataTable1337Labs,{displayActive,moneyFormat,generateLink,actionFormatter} from "../../components/RemoteDataTable1337Labs/RemoteDataTable1337Labs";
import { textFilter, numberFilter, selectFilter } from 'react-bootstrap-table2-filter';

//import moment from 'moment';

class Leads extends Component{
  constructor(props) {
    super(props);
    this.state = {
        isLoaded: false,
        dataLoaded: false,
        cols: null
    };
  } 

  componentDidMount() {    
    //if(!this.state.defaultFilter)    
    this.fetchLayout();
  }

  fetchLayout(){
    fetch(`${process.env.REACT_APP_API_URL}/api/leads/leadsbrowselayout/?page_size=100`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Token '+sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1')}
    })
    .then(res => res.json())
    .then(data => {   
        this.setState({
          cols: data.results,
          isLoaded: true,       
        });
    })
    .catch(error => {
        console.log(error);
    });
  }

  getLeadsState = (data) => {
    console.log("getLeadsState",getLeadsState)
    this.setState({
      'items':data.items,
      'dataLoaded': true
    })
  }
  
  render() {  
    const { isLoaded, cols, loaded } = this.state;
    var columns = [];
    for (var prop in cols) {
      let col = this.state.cols[prop];
      let filter = null;
      if(Boolean(col.layout_field_searchable)){
        if(col.layout_field.field_type === "text"){
          filter = textFilter();
        }
        if(col.layout_field.field_type === "integer"){
          filter = numberFilter();
        }
        if(col.layout_field.field_type === "boolean"){
          const selectOptions = {
            true: 'True',
            false: 'False'
          };
          // formatter = cell => selectOptions[cell],
          filter = selectFilter({
            options: selectOptions
          })
        }
      }
      columns.push({ 'text':col.layout_field.field_label,
                     'dataField': 'data.'+col.layout_field.field_api_name,
                     'sort': Boolean(col.layout_field_sortable),
                     'filter': filter,
                  });
    }
    columns.push({'text':'ID', 'dataField': 'id','hidden':true})
    columns.push({
                  'text':'Actions', 
                  'dataField':'actions',
                  'sort': 'false', 
                  'formatter': actionFormatter,
                  'formatExtraData':{
                                    'link_to':'add-edit-lead',
                                    'query_vars':[
                                      {'param_name':'lead_id','field_name':'id'}
                                    ],
                                    'state':this.state,
                                    'edit':true,
                                    'editstr':'Edit',
                                    'delete':true,
                                    }
                  })

    // console.log(columns)


    let initialFilterQuery = '';
    if(sessionStorage.getItem("authId")!==null){
      // initialFilterQuery = "garage__admin="+sessionStorage.getItem("authId")
    }

    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Leads</h4>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/#">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Leads</li>
                </ol>
              </div>
            </Col>
          </Row>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                      {
                          isLoaded ?
                                <RemoteDataTable1337Labs
                                apiUrl="/api/leads"
                                keyField="id"
                                startPage="1"
                                columns={ columns }
                                sizePerPage="10"
                                initialFilterQuery={ initialFilterQuery }  
                                leadsState = {this.getLeadsState}                              
                              /> :
                              'Waiting' // or whatever loading state you want, could be null
                      }             
                </div>
              </div>
            </div>
          </div>

        </div>

      </React.Fragment>
    );
  }
}

export default Leads;