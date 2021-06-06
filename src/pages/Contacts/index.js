import React, { Component } from "react";
import { Row, Col, Button, Alert } from "reactstrap";
import { Link } from "react-router-dom";

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import BootstrapTable from 'react-bootstrap-table-next';

//import { Button } from 'react-bootstrap'
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import { textFilter, numberFilter, Comparator, selectFilter } from 'react-bootstrap-table2-filter';

import moment from 'moment';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

const RemoteAll = ({ columns, data, page, sizePerPage, defaultSorted, onTableChange, totalSize, selectRow, rowStyle }) => (
    <PaginationProvider
        pagination={ paginationFactory({custom: true, page, sizePerPage, totalSize: totalSize, sizePerPageList: [20,50,100]}) }
      >
        {
          ({
            paginationProps,
            paginationTableProps
          }) => (
            <div>
              <BootstrapTable
                bootstrap4
                remote
                keyField="id"
                data={ data }
                columns={ columns }
                defaultSorted={ defaultSorted }
                filter={ filterFactory() }
                filterPosition="top"
                // pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
                { ...paginationTableProps }
                onTableChange={ onTableChange }
                selectRow={ selectRow }
                rowStyle={ rowStyle }
                noDataIndication={ 'No results found' }
              />
              <SizePerPageDropdownStandalone 
                { ...paginationProps }
              />
              <PaginationTotalStandalone
                { ...paginationProps }
              />
              <PaginationListStandalone
                { ...paginationProps }
              />
            </div>
          )
        }
      </PaginationProvider>
  );

class Contacts extends Component{
  constructor(props) {
    super(props);
    this.state = {
        isLayoutLoaded: false,
        isDataLoaded: false,
        cols: null,
        page: 1,
        sizePerPage: 20,
        initialFilterQuery: null,
        superuser:false,
        agent:false,
        selected:[]
    };
    
    this.handleTableChange = this.handleTableChange.bind(this)
  } 

  async componentDidMount() {    
    if(sessionStorage.getItem("authId")!==null &&sessionStorage.getItem("access") == "agent" ){
      this.setState({
        initialFilterQuery:"&allocated_to="+sessionStorage.getItem("authId"),
        agent:true,
        superuser:false
      })
    }
    if(sessionStorage.getItem("authId")!==null &&sessionStorage.getItem("access") == "superuser" ){
      this.setState({
        superuser:false,
        agent:false
      })
    }
    await this.fetchLayout();
    await this.fetchData();
    if(this.props.location.state){
      if(this.props.location.state.redirectedstate!== null && this.props.location.state.redirectedstate!== undefined){
        let redirectedstate = this.props.location.state.redirectedstate
        this.setState({
          loading: false,
          items: redirectedstate.items, 
          page: redirectedstate.page,
          sizePerPage: redirectedstate.sizePerPage,
          nextpage: redirectedstate.nextpage,
          prevpage: redirectedstate.prevpage,
          totalSize: redirectedstate.totalSize,
          filters:redirectedstate.filters,
          isDataLoaded:true, 
        })
        
      } else {
        await this.fetchData();
      }
    } else {
      await this.fetchData();
    }
    
  }

  componentDidUpdate(){
    
  }

  fetchLayout(){
    fetch(`${process.env.REACT_APP_API_URL}/api/contacts/contactsbrowselayout/?page_size=100`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Token '+sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1')}
    })
    .then(res => res.json())
    .then(data => {   
        this.setState({
          cols: data.results,
          isLayoutLoaded: true,       
        });
    })
    .catch(error => {
        // console.log(error);
    });
  }

  fetchData() {
    const { loaded,sizePerPage, page, totalSize, columns, items, keyField, SearchByDates, initialFilterQuery, sortField, sortOrder, filters, searchText  } = this.state;
    let qs =  {}

    // console.log('FetchData');
    // console.log(this.state.filters)
    
    qs = `/?&page=`+page+`&page_size=`+sizePerPage;

    if(initialFilterQuery){
      qs = qs + initialFilterQuery
    }

    for (let dataField in filters) {
      const { filterVal, filterType, comparator } = filters[dataField];
      dataField = dataField.replace(/\./g,'__')
      if(filterType==="TEXT"){            
        qs += '&'+dataField+'__icontains='+filterVal
      }
      if(filterType==="NUMBER"){
        if(filterVal.comparator===">"){
          qs += '&'+dataField+'__gt='+filterVal.number
        } else if(filterVal.comparator===">="){
          qs += '&'+dataField+'__gte='+filterVal.number
        } else if(filterVal.comparator==="<"){
          qs += '&'+dataField+'__lt='+filterVal.number
        } else if(filterVal.comparator==="<="){
          qs += '&'+dataField+'__lte='+filterVal.number
        }  else if(filterVal.comparator==="!="){
          qs += '&'+dataField+'!='+filterVal.number
        }  else if(filterVal.comparator==="="){
          qs += '&'+dataField+'='+filterVal.number
        }
      }
      if(filterType==="DATE"){
        if(moment(filterVal.date).isValid()){
          let dateVal = moment(filterVal.date).format('YYYY-MM-DD')
          if(filterVal.comparator===">"){
            qs += '&'+dataField+'__gt='+dateVal
          } else if(filterVal.comparator===">="){
            qs += '&'+dataField+'__gte='+dateVal
          } else if(filterVal.comparator==="<"){
            qs += '&'+dataField+'__lt='+dateVal
          } else if(filterVal.comparator==="<="){
            qs += '&'+dataField+'__lte='+dateVal
          }  else if(filterVal.comparator==="!="){
            qs += '&'+dataField+'!='+dateVal
          }  else if(filterVal.comparator==="="){
            qs += '&'+dataField+'__startswith='+dateVal
          }
        }
      }
      if(filterType==="SELECT"){
        if(comparator === "="){
          qs += '&'+dataField+'='+filterVal
        }
      }
    }

    if(typeof sortField !=='undefined' && typeof sortOrder!=='undefined'){
      let sortFieldVar = sortField.replace(/\./g,'__')
      //console.log("Replaced:"+sortField)
      if(sortOrder ==='asc'){
        qs += '&ordering='+sortFieldVar
      } else if(sortOrder ==='desc'){
        qs += '&ordering=-'+sortFieldVar
      }
    }

    if(typeof searchText !== 'undefined'){
      qs += '&search='+searchText
    }

    fetch(`${process.env.REACT_APP_API_URL}`+'/api/contacts'+qs, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Token '+sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1')}
    })
    .then(res => res.json())
    .then(data => {      
      
        this.setState({
          loading: false,
          items: data.results, 
          totalSize: data.total, 
          page:data.page, 
          nextpage: data.links.next,
          prevpage: data.links.previous,
          sizePerPage:data.page_size,
          isDataLoaded:true,            
        });
    })
    .catch(error => {
        // console.log(error);
    });
  }

  handleTableChange(type, { page, sizePerPage, sortField, sortOrder, filters, searchText }){ 
    // console.log('Filters')
    // console.log(filters)     
    this.setState({ 
      page: page,
      sizePerPage: sizePerPage,
      loading: true,
      sortField:sortField,
      sortOrder:sortOrder,
      filters:filters,
      loaded:true
    }, ()=> this.fetchData());
  }

  phoneFormatter = (cell,row,rowIndex,formatExtraData)=>{
    let phonelink;
    if(cell != null){
      let cell_sip = "sip:"+cell;
      return(<a href={cell_sip}>{cell}</a>)
    }
    return(phonelink);
  }

  dateFormatter= (cell,row,rowIndex,formatExtraData)=>{
    if(cell){
      if(moment(cell).isValid()){
        const type = formatExtraData.type;
        if(type == "date"){
          cell = moment(cell).format('DD/MM/YYYY');
        } else if(type == "datetime"){
          cell = moment(cell).format('DD/MM/YYYY h:mm:ss a');
        }
      }
    }
    return(cell);
  }

  actionFormatter = (cell,row,rowIndex,formatExtraData)=>{
    let editlink;
    const edit = formatExtraData.edit; 
    const del = formatExtraData.delete;
    
    let query_items = {};     
    if(formatExtraData.query_vars){
      Object.entries(formatExtraData.query_vars).map(([key, value]) => { 
          if (value.field_name.indexOf('.') > -1){
            let temp_field_name = value.field_name.split('.');
            let valuestr;
            let rowArr = row[temp_field_name[0]][temp_field_name[1]];
            temp_field_name.forEach(element => {                
              if(typeof rowArr === "string"){
                valuestr = rowArr;
              } else {
                rowArr = rowArr[element];
              }
            });
            query_items[value.param_name] = valuestr;
          } else {
            query_items[value.param_name] = row[value.field_name]
          }             
      })
    }

    // if(formatExtraData.state_vars){
    //   Object.entries(formatExtraData.state_vars).map(([key, value]) => { 
    //       if (value.field_name.indexOf('.') > -1){
    //         let temp_field_name = value.field_name.split('.');
    //         let valuestr;
    //         let rowArr = row[temp_field_name[0]][temp_field_name[1]];
    //         temp_field_name.forEach(element => {                
    //           if(typeof rowArr === "string"){
    //             valuestr = rowArr;
    //           } else {
    //             rowArr = rowArr[element];
    //           }
    //         });
    //         state_items[value.param_name] = valuestr;
    //       } else {
    //         state_items[value.param_name] = row[value.field_name]
    //       }             
    //   })
    // }
    
    let QueryString = Object.keys(query_items).map(key => key + '=' + query_items[key]).join('&');
    
    if(edit){
      // console.log('edit link')
      // console.log(this.state.filters)
      let state_vars = {'items':this.state.items, 'page': this.state.page,'page': this.state.page, 'sizePerPage': this.state.sizePerPage, 'totalSize': this.state.totalSize, 'nextpage': this.state.nextpage, 'prevpage':this.state.prevpage, filters:this.state.filters}
      editlink = <Link to={{
        pathname:formatExtraData.link_to,
        search: "?"+QueryString,
        state: formatExtraData.state_vars,
      }} > <u>{formatExtraData.editstr}</u></Link>
    }
  
    return(editlink)
  }

  handleOnSelect = (row, isSelect, rowIndex, e) => {
    // console.log('bla')
    // let target = e.target;
    // console.log(JSON.stringify(e.target))
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id)
      }));
    }
  }

  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  }

  deleteSelected = () => {
    const {selected} =  this.state

    fetch(`${process.env.REACT_APP_API_URL}`+'/api/contacts/delete-contacts/', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Token '+sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1')},
      body: JSON.stringify(selected)
    })
    .then(res => res.json())
    .then(data => {      
      this.setState({
        showDelAlert: true,
        totaldeleted: selected.length,
        selected:[]
      })
      this.fetchData();
    })
    .catch(error => {
        // console.log(error);
    });    
    
  }

  
  render() {  
    const { isLayoutLoaded, isDataLoaded, cols, page, sizePerPage, selected, showDelAlert, totaldeleted, superuser, agent } = this.state;
    // console.log(this.state)
    var columns = [];
    let selectRow;
    if(superuser){
      selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: this.handleOnSelect,
        onSelectAll: this.handleOnSelectAll
      };
    } else {
      selectRow = undefined;
    }

    if((isLayoutLoaded)){
      let total_col_units =0 ;
      for (var prop in cols) {
        total_col_units += parseInt(this.state.cols[prop].layout_col_width);
      }
      let per_unit_width = 80/total_col_units;
      for (var prop in cols) {
        let col = this.state.cols[prop];
        let filter = null;
        let col_width = col.layout_col_width * per_unit_width;
        if(col.layout_field_searchable){
          // console.log(col)
          if(col.layout_field.field_type === "text" || col.layout_field.field_type === "email" || col.layout_field.field_type === "phone"){
            filter = textFilter();
            if(this.state.filters){
              let field_name = 'data.'+col.layout_field.field_api_name
              if(this.state.filters[field_name]){
                filter = textFilter({defaultValue: this.state.filters[field_name]['filterVal']});
              }
            }
          }
          if(col.layout_field.field_type === "integer" || col.layout_field.field_type === "bigint"){
            filter = numberFilter();
            if(this.state.filters){
              let field_name = 'data.'+col.layout_field.field_api_name
              if(this.state.filters[field_name]){
                filter = numberFilter({defaultValue: this.state.filters[field_name]['filterVal']});
              }
            }
          }
          if(col.layout_field.field_type === "picklist"){
            let selectOptions_tmp = Object.fromEntries(Object.entries(col.layout_field.field_data).sort(function (a, b) {
              return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase());
            }))
            let selectOptions = Object.assign({}, ...Object.entries(selectOptions_tmp).map(([a,b]) => ({ [a]: a })))
            filter = selectFilter({
              options: selectOptions
            })
            if(this.state.filters){
              let field_name = 'data.'+col.layout_field.field_api_name
              if(this.state.filters[field_name]){
                filter = selectFilter({
                  options: selectOptions,
                  defaultValue: this.state.filters[field_name]['filterVal']
                })
              }
            }
          }
          if(col.layout_field.field_type === "lookup"){
            let selectOptions_tmp = Object.fromEntries(Object.entries(col.layout_field.field_data).sort(function (a, b) {
              return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase());
            }))
            let selectOptions = Object.assign({}, ...Object.entries(selectOptions_tmp).map(([a,b]) => ({ [b]: a })))
            filter = selectFilter({
              options: selectOptions
            })
            if(this.state.filters){
              let field_name = 'data.'+col.layout_field.field_api_name
              if(this.state.filters[field_name]){
                filter = selectFilter({
                  options: selectOptions,
                  defaultValue: this.state.filters[field_name]['filterVal']
                })
              }
            }
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

        if( col.layout_field.field_type === "phone" ){
          columns.push({ 'text':col.layout_field.field_label,
                      'dataField': 'data.'+col.layout_field.field_api_name,
                      'sort': Boolean(col.layout_field_sortable),
                      'filter': filter,
                      'formatter': this.phoneFormatter,
                      'headerStyle': (column, colIndex) => {
                        return {
                          width: col_width+'%'
                        };
                      },
                    });
        } else if(col.layout_field.field_type === "date" || col.layout_field.field_type === "datetime"){
          columns.push({ 'text':col.layout_field.field_label,
                      'dataField': 'data.'+col.layout_field.field_api_name,
                      'sort': Boolean(col.layout_field_sortable),
                      'filter': filter,
                      'formatter': this.dateFormatter,
                      'formatExtraData':{
                        'type': col.layout_field.field_type
                      },
                      'headerStyle': (column, colIndex) => {
                        return {
                          width: col_width+'%'
                        };
                      },
                    });
        } else {
          columns.push({ 'text':col.layout_field.field_label,
                      'dataField': 'data.'+col.layout_field.field_api_name,
                      'sort': Boolean(col.layout_field_sortable),
                      'filter': filter,
                      'headerStyle': (column, colIndex) => {
                        return {
                          width:  col_width+'%'
                        };
                      },
                    });
        }
      }
      columns.push({'text':'ID', 'dataField': 'id','hidden':true})
      columns.push({
                    'text':'Actions', 
                    'dataField':'actions',
                    'sort': false, 
                    'formatter': this.actionFormatter,
                    'headerStyle': (column, colIndex) => {
                      return {
                        width: '5%'
                      };
                    },
                    'formatExtraData':{
                                      'link_to':'add-edit-contact',
                                      'query_vars':[
                                        {'param_name':'contact_id','field_name':'id'}
                                      ],
                                      'state_vars':
                                        {'items':this.state.items, 'page': this.state.page,'page': this.state.page, 'sizePerPage': this.state.sizePerPage, 'totalSize': this.state.totalSize, 'nextpage': this.state.nextpage, 'prevpage':this.state.prevpage, filters:this.state.filters}
                                      ,
                                      'edit':true,
                                      'editstr':'Edit',
                                      'delete':true,
                                      }
                    })
      // console.log('Cols')
      // console.log(columns)
    }

    const rowStyle = (row, rowIndex) => {
      const style = {};
      if (rowIndex % 2 == 0) {
        style.backgroundColor = '#f8f9fa';
      }    
      return style;
    };

    console.log("opened = ", this.props.opened);
    if (this.props.opened) {
      return (
        <Redirect to='/chat'/>
      );
    } else {
      return (
        <React.Fragment>
          <div className="container-fluid">
            {/*}
            <Row className="align-items-center">
              <Col sm={6}>
                <div className="page-title-box">
                  <h4 className="font-size-18">Contacts</h4>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to="/#">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Contacts</li>
                  </ol>
                </div>
              </Col>
            </Row>
      */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                        {showDelAlert ? 
                        <Alert
                          color="success"
                          toggle={() =>
                            this.setState({ showDelAlert: !this.state.showDelAlert })
                          }
                        >
                          <strong>{totaldeleted}</strong> records succesfully deleted.
                        </Alert> : ''}
                        {superuser ?
                        <div className="mb-1">
                        {selected.length > 0 ? <Button color="danger" className="btn btn-danger waves-effect waves-light" onClick={this.deleteSelected}>Delete Selected</Button>:<Button color="danger" disabled outline className="waves-effect waves-light">Delete Selected</Button>}
                        </div>
                        :''}
                        {
                            (isLayoutLoaded && isDataLoaded) ?
                                  <RemoteAll
                                  columns = { columns }
                                  data={ this.state.items }
                                  page={ page }
                                  sizePerPage={ sizePerPage }
                                  totalSize={ this.state.totalSize }
                                  onTableChange={ this.handleTableChange }
                                  selectRow={ selectRow }
                                  rowStyle={ rowStyle }
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
}

const mapStatetoProps = state => ({
  opened: state.opened,
})


export default connect(mapStatetoProps, null)(Contacts);