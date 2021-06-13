import React, { Component, Fragment } from "react";
//import SettingMenu from "../../Shared/SettingMenu";
import { Row, Col, Alert } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import { AvForm, AvField, AvCheckboxGroup, AvCheckbox, AvSelect, AvInput } from "availity-reactstrap-validation";
import moment from 'moment';

class AddEditContact  extends Component {

    constructor(props) {
        super(props);
        let contact_id = null;
        let navigation_state = null;
        if (props.location.search) {
            const queryString = require('query-string');
            const qs = queryString.parse(this.props.location.search);
            navigation_state = this.props.location.state;
            if (qs.contact_id) {
                contact_id = qs.contact_id
            }
        }
        // console.log('constructor')
        // console.log(navigation_state)
        this.state = {
            fields: null,
            contact_id: contact_id,
            navigation_state: navigation_state,
            isLoaded: false,
            gonext: null,
            gonosubmitnext: null,
            goprev: null,
            gonosubmitprev: null,
            formsubmitted: null,
            redirect: false,
            data: {},
            currentPage: null,
        };
        this.generateLayout = this.generateLayout.bind(this);
        this.generateColumns = this.generateColumns.bind(this);
        this.generateColumnContent = this.generateColumnContent.bind(this);
        this.renderNextNavigationButton = this.renderNextNavigationButton.bind(this)
        this.renderPrevNavigationButton = this.renderPrevNavigationButton.bind(this)
        this.renderPageAndGoNext = this.renderPageAndGoNext.bind(this)
        this.renderPageAndGoPrevious = this.renderPageAndGoPrevious.bind(this)
        this.redirectHandler = this.redirectHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        await this.fetchLayout();
        console.log("states", this.state);

        this.fetchRecord();
    }
    // componentWillMount() {
    //     this.fetchRecord();
    // }
    componentDidUpdate() {
        const { navigation_state, nextindex, previndex, gonext, gonosubmitnext,currentPage, goprev, gonosubmitprev, formsubmitted, currentindex } = this.state
        //  console.log("navigation_state.items[currentindex].data", navigation_state.items[currentindex])
        if ((gonext && formsubmitted) || gonosubmitnext) {
            console.log("gonext")

            if (navigation_state.items[nextindex]) {
                this.setState({
                    gonext: false,
                    gonosubmitnext: false,
                    formsubmitted: false,
                    contact_id: navigation_state.items[nextindex].id
                }, () => {
                    this.props.history.push(this.props.location.pathname + "?contact_id=" + navigation_state.items[nextindex].id);
                    this.fetchRecord();
                })
            } else {
                this.renderPageAndGoNext();
            }
        }



        if ((goprev && formsubmitted) || gonosubmitprev) {
            console.log("goprev")

            if (navigation_state.items[previndex]) {
                this.setState({
                    goprev: false,
                    gonosubmitprev: false,
                    formsubmitted: false,
                    contact_id: navigation_state.items[previndex].id
                }, () => {
                    this.props.history.push(this.props.location.pathname + "?contact_id=" + navigation_state.items[previndex].id);
                    this.fetchRecord();
                })
            }
        }
        if ((formsubmitted && currentPage)) {
            console.log("save")
            if (navigation_state.items[currentindex]) {
                this.setState({
                    gonext: false,
                    gonosubmitnext: false,
                    formsubmitted: false,
                    contact_id: navigation_state.items[currentindex].id
                }, () => {
                    this.props.history.push(this.props.location.pathname + "?contact_id=" + navigation_state.items[currentindex].id);
                    this.fetchRecord();
                    // this.renderSubmitAndNextButton()
                })
            } else {
                this.renderPageAndGoNext();
            }
        }
    }

    fetchLayout() {
        const { fields } = this.state;
        if (!fields) {
            fetch(`${process.env.REACT_APP_API_URL}/api/contacts/contactsaddeditlayout/?page_size=100`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1') }
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        fields: data.results,
                    });
                    if (this.state.contact_id) {
                        this.fetchRecord();
                    } else {
                        this.setState({
                            isLoaded: true,
                        })
                        this.fetchRecord();
                    }
                })
                .catch(error => {
                    // console.log(error);
                });
        } else {
            if (this.state.contact_id) {
                this.fetchRecord();
            } else {
                this.setState({
                    isLoaded: true,
                })
            }
        }
    }

    fetchRecord() {

        if (this.state.contact_id && this.state.navigation_state) {


            this.state.navigation_state.items.map((item, i) => {

                if (this.state.contact_id == item.id) {
                    fetch(`${process.env.REACT_APP_API_URL}/api/contacts/` + this.state.contact_id + '/', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1') }
                    })
                        .then(res => res.json())
                        .then(data => {
                            this.setState({
                                record: data,
                                isLoaded: true,
                            });

                        })
                        .catch(error => {

                        });
                    this.setState({
                        record: item,
                        isLoaded: true,
                        currentindex: i,
                        nextindex: i + 1,
                        previndex: i - 1,
                    });
                }
            })
        }
        else {

            fetch(`${process.env.REACT_APP_API_URL}/api/contacts/` + this.state.contact_id + '/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1') }
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        record: data,
                        isLoaded: true,
                    });

                })
                .catch(error => {

                });
        }
    }

    generateColumnContent(field) {
        let layoutline = [];
        if (field.layout_hr) layoutline.push(<hr className="bg-primary" key={field.id} />);
        if (field.layout_nbsp) layoutline.push(<React.Fragment key={field.id}>&nbsp;</React.Fragment>);
        if (field.layout_field_display_only) {
            if (field.layout_field) {
                let value = null;
                if (this.state.record) value = this.state.record.data[field.layout_field.field_api_name];
                layoutline.push(<label key="{field.layout_field.id}-label">{field.layout_field.field_label}</label>);
                if (field.layout_field.field_type === "phone") {
                    let value_sip = "sip:" + value
                    layoutline.push(<div key="{field.layout_field.id}-div"><a href={value_sip}>{value}</a></div>)
                } else {
                    if (field.layout_field.field_type === "date" || field.layout_field.field_type === "datetime") {
                        if (moment(value).isValid()) {
                            if (field.layout_field.field_type === "datetime") {
                                value = moment(value).format('DD/MM/YYYY h:mm:ss a');
                            } else {
                                value = moment(value).format('DD/MM/YYYY');
                            }
                        }
                    }
                    layoutline.push(<div key="{field.layout_field.id}-div">{value}</div>)
                }
            }
        } else {
            if (field.layout_field) {
                let value = '';
                let field_size = null, readonlystr = null;
                let validator = []
                let validate = {}

                if (this.state.record) value = this.state.record.data[field.layout_field.field_api_name];
                if (field.layout_field.field_ismandatory) validate.required = { 'value': true }
                if (field.layout_field.field_size) validate.maxLength = { value: field.layout_field.field_size }
                if (field.layout_field.field_isreadonly) readonlystr = true

                if (field.layout_field.field_type === "text" || field.layout_field.field_type === "phone") {
                    if (value == null) value = ''
                    let autocomplete = Math.random().toString(36).substring(7)
                    layoutline.push(<AvField key={field.layout_field.id} value={value} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="text" autoComplete={autocomplete} errorMessage={"Enter " + field.layout_field.field_label} validate={validate} />)
                }
                if (field.layout_field.field_type === "textarea") {
                    if (value == null) value = ''
                    layoutline.push(<AvField key={field.layout_field.id} value={value} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="textarea" errorMessage={"Enter " + field.layout_field.field_label} validate={validate} />)
                }
                if (field.layout_field.field_type === "email") {
                    if (value == null) value = ''
                    layoutline.push(<AvField key={field.layout_field.id} value={value} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="email" errorMessage={"Enter " + field.layout_field.field_label} validate={validate} />)
                }
                if (field.layout_field.field_type === "integer") {
                    if (value == null) value = ''
                    layoutline.push(<AvField key={field.layout_field.id} value={value} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="number" errorMessage={"Enter " + field.layout_field.field_label} validate={validate} />)
                }
                if (field.layout_field.field_type === "double" || field.layout_field.field_type === "currency") {
                    if (value == null) value = ''
                    layoutline.push(<AvField key={field.layout_field.id} value={value} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="number" step="0.01" errorMessage={"Enter " + field.layout_field.field_label} validate={validate} />)
                }
                if (field.layout_field.field_type === "date") {
                    if (value == null) value = ''
                    layoutline.push(<AvField key={field.layout_field.id} value={value} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="date" errorMessage={"Enter " + field.layout_field.field_label} validate={validate} />)
                }
                if (field.layout_field.field_type === "datetime") {
                    if (value == null) value = ''
                    layoutline.push(<AvField key={field.layout_field.id} value={value} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="datetime" errorMessage={"Enter " + field.layout_field.field_label} validate={validate} />)
                }
                if (field.layout_field.field_type === "boolean") {
                    if (value == null) value = ''
                    layoutline.push(<AvField key={field.layout_field.id} type="checkbox" name={field.layout_field.field_api_name} label={field.layout_field.field_label} validate={validate} />)
                }
                if (field.layout_field.field_type === "picklist") {
                    let options = [];
                    let selected = null;
                    if (value == null) value = ''
                    let selectOptions_tmp = Object.fromEntries(Object.entries(field.layout_field.field_data).sort(function (a, b) {
                        return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase());
                    }))
                    let selectOptions = Object.assign({}, ...Object.entries(selectOptions_tmp).map(([a, b]) => ({ [a]: a })))
                    Object.entries(selectOptions).map((data, index) => {
                        options.push(<option key={field.layout_field.id + data[1]} value={data[1]}>{data[0]}</option>)
                        if (value == data[0]) selected = data[1];
                    })

                    if (selected !== null) {
                        layoutline.push(<AvField key={field.layout_field.id} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="select" value={selected} errorMessage={"Enter " + field.layout_field.field_label} validate={validate}>
                            {options}
                        </AvField>)
                    } else {
                        layoutline.push(<AvField key={field.layout_field.id} readOnly={readonlystr} value="" name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="select" errorMessage={"Enter " + field.layout_field.field_label} validate={validate}>
                            {options}
                        </AvField>)
                    }
                }
                if (field.layout_field.field_type === "lookup") {
                    let options = [];
                    let selected = null;
                    if (value == null) value = ''
                    let obj = field.layout_field.field_data;
                    let sorted_lookup = Object.fromEntries(Object.entries(obj).sort(function (a, b) {
                        return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase());
                    }))
                    options.push(<option key={field.layout_field.id} value=''>None</option>)

                    Object.entries(sorted_lookup).map((data, index) => {
                        options.push(<option key={field.layout_field.id + data[1]} value={data[1]}>{data[0]}</option>);
                        if (value == data[0]) selected = data[1];
                    })

                    if (selected !== null) {
                        layoutline.push(<AvField key={field.layout_field.id} readOnly={readonlystr} name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="select" value={selected} errorMessage={"Enter " + field.layout_field.field_label} validate={validate}>
                            {options}
                        </AvField>)
                    } else {
                        layoutline.push(<AvField key={field.layout_field.id} readOnly={readonlystr} value="" name={field.layout_field.field_api_name} label={field.layout_field.field_label} type="select" errorMessage={"Enter " + field.layout_field.field_label} validate={validate}>
                            {options}
                        </AvField>)
                    }
                }
            }
        }
        return layoutline;
    }

    generateColumns(rowNumber) {
        const { contact_id, isLoaded, fields } = this.state;

        let layoutline = [];
        fields && fields.length > 0 && fields.map((field, index) => {
            if (field.layout_row == rowNumber) {
                let key = field.id + '-col-' + index
                layoutline.push(<div key={key} className={"col-" + field.layout_col_size}>{this.generateColumnContent(field)}</div>);
            }
        })
        return layoutline;
    }

    generateLayout() {
        const { contact_id, isLoaded, fields } = this.state;
        let layoutline = [];
        if (isLoaded) {
            let i = 0;

            let prev_layout_row = 0
            fields && fields.length > 0 && fields.map((field, index) => {
                if ((!contact_id && field.layout_field_display_add_screen) || contact_id) {
                    if (field.layout_row !== prev_layout_row) {
                        layoutline.push(<div key={field.id} className="row">{this.generateColumns(field.layout_row)}</div>);
                    }

                    prev_layout_row = field.layout_row;
                }
            })
            return layoutline;
        }

    }

    handleSubmit = (event, errors, values) => {

        const { contact_id, record, navigation_state, currentindex, nextindex, previndex, gonext, data, submit } = this.state;
        console.log("navigation_state", navigation_state)
        this.setState({
            submit: true
        })
        let submitdata = {};
        var original_data = record.data
        Object.entries(values).map((value) => {
            original_data[value[0]] = value[1];
        })
        submitdata.data = original_data

        event.persist();

        // this.fetchRecord();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.REACT_APP_API_URL}/api/contacts/` + contact_id + '/', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1') },
                body: JSON.stringify(submitdata)
            })
                .then(
                    res => res.json()
                )
                .then(
                    res => {

                        if (res.error == "true") {
                            let fail_msg = res.detail.api_name + ' - ' + res.message
                            this.setState({
                                formsubmitted: false,
                                showFailureAlert: true,
                                showFailureMessage: fail_msg,
                                showSuccessAlert: false,


                            })

                        } else if (gonext) {
                            this.setState({
                                navigation_state: navigation_state,
                                formsubmitted: true,
                                showSuccessAlert: false,
                                showFailureAlert: false,
                                showFailureMessage: '',

                            })
                        } else {

                            console.log("naviiii", navigation_state.items[currentindex].data)

                            navigation_state.items[currentindex].data = res.data;

                            this.setState({
                                navigation_state: navigation_state,
                                formsubmitted: true,
                                currentPage: true,
                                showSuccessAlert: true,
                                showFailureAlert: false,
                                showFailureMessage: '',

                            })
                        }
                    },
                    error => {
                        // console.log('Error');
                        reject(this._handleError(error));
                    }
                )
                .catch(error => console.log(error))
        }
        );




    }

    renderPrevNavigationButton = () => {
        const { navigation_state, previndex, isLoaded } = this.state;
        if (isLoaded) {

            if (navigation_state) {
                if (navigation_state.items) {
                    if (navigation_state.items[previndex]) {
                        return (<button className="btn btn-primary btn-sm waves-effect waves-light btn btn-primary" onClick={() => this.setState({ gonosubmitprev: true, showSuccessAlert: false, showFailureAlert: false })}> &lt; </button>)
                    } else {
                        if (navigation_state.prevpage) {
                            return (<button className="btn btn-primary btn-sm waves-effect waves-light btn btn-primary" onClick={this.renderPageAndGoPrevious}> &lt; </button>)
                        } else {
                            return (<button className="btn btn-primary btn-sm waves-effect waves-light btn btn-primary disabled"> &lt; </button>)
                        }
                    }
                }
            }
        }
    }

    renderNextNavigationButton = () => {
        const { navigation_state, nextindex, isLoaded } = this.state;
        if (isLoaded) {

            if (navigation_state) {
                if (navigation_state.items) {
                    if (navigation_state.items[nextindex]) {
                        return (<button className="btn btn-primary btn-sm waves-effect waves-light btn btn-primary" onClick={() => this.setState({ gonosubmitnext: true, showSuccessAlert: false, showFailureAlert: false })}> &gt; </button>)
                    } else {
                        if (navigation_state.nextpage) {
                            return (<button className="btn btn-primary btn-sm waves-effect waves-light btn btn-primary" onClick={this.renderPageAndGoNext}> &gt; </button>)
                        } else {
                            return (<button className="btn btn-primary btn-sm waves-effect waves-light btn btn-primary disabled"> &gt; </button>)
                        }
                    }
                }
            }
        }
    }

    renderSubmitAndNextButton = () => {
        const { navigation_state, nextindex, isLoaded } = this.state;
        console.log("renderSubmitAndNextButton", navigation_state)



        if (isLoaded) {
            if (navigation_state) {
                if (navigation_state.items) {
                    if (navigation_state.items[nextindex]) {
                        return (<button type="submit" form="lead_form" className="btn btn-primary" onClick={() => this.setState({ gonext: true, })}>Save & Edit Next Record</button>)
                    } else {
                        console.log("renderSubmit", navigation_state)
                        if (navigation_state.nextpage) {
                            return (<button type="submit" form="lead_form" className="btn btn-primary" onClick={() => this.setState({ gonext: true, })}>Save & Edit Next Record</button>)
                        } else {
                            return (<button type="submit" form="lead_form" className="btn btn-primary" disabled>Save & Edit Next Record</button>)
                        }
                    }
                }
            }
        }
    }

    renderPageAndGoNext = () => {
        const { navigation_state } = this.state
        console.log("goback", navigation_state)

        fetch(navigation_state.nextpage, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1') }
        })
            .then(res => res.json())
            .then(data => {
                navigation_state.items = data.results
                navigation_state.nextpage = data.links.next
                navigation_state.prevpage = data.links.previous
                navigation_state.page = data.page
                navigation_state.sizePerPage = data.page_size
                navigation_state.totalSize = data.total
                this.setState({
                    navigation_state: navigation_state,
                    nextindex: 0,
                    previndex: 0,
                    contact_id: data.results[0],
                    gonosubmitprev: false,
                    gonosubmitnext: true,
                    showSuccessAlert: false,
                    showFailureAlert: false,
                }, () => {
                    // console.log(this.state)
                });
            })
            .catch(error => {
                // console.log(error);
            });

    }

    renderPageAndGoPrevious = () => {
        const { navigation_state } = this.state
       
        fetch(navigation_state.prevpage, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + sessionStorage.getItem("authUser").replace(/^"(.*)"$/, '$1') }
        })
            .then(res => res.json())
            .then(data => {
                navigation_state.items = data.results
                navigation_state.nextpage = data.links.next
                navigation_state.prevpage = data.links.previous
                navigation_state.page = data.page
                navigation_state.sizePerPage = data.page_size
                navigation_state.totalSize = data.total
                this.setState({
                    navigation_state: navigation_state,
                    nextindex: 0,
                    previndex: parseInt(data.page_size) - 1,
                    contact_id: data.results[parseInt(data.page_size) - 1].id,
                    gonosubmitprev: true,
                    gonosubmitnext: false,
                    showSuccessAlert: false,
                    showFailureAlert: false,
                });
            })
            .catch(error => {
                // console.log(error);
            });
    }

    redirectHandler = () => {
        this.setState({ redirect: true }, () => {
            this.renderRedirect();
        })
    }

    renderRedirect = () => {
        const { navigation_state, redirect } = this.state

        if (this.state.redirect) {

            return <Redirect to={{
                pathname: "/contacts",
                state: { redirectedstate: navigation_state }
            }} />
        }
    }


    render() {
        const { contact_id, isLoaded, fields, data, navigation_state, nextindex, previndex, currentindex, redirectToLeads, showSuccessAlert, showFailureAlert, showFailureMessage } = this.state;

        console.log("this.state.navigation_state", navigation_state)


        return (
            <React.Fragment>
                <div className="container-fluid">
                    {/*}
                <Row className="align-items-center">
                <Col sm={6}>
                    <div className="page-title-box">
                    <h4 className="font-size-18">Leads</h4>
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                        <Link to="/#">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active">{contact_id ? 'Edit Lead' : 'Add Lead'}</li>
                    </ol>
                    </div>
                </Col>
                </Row>
        */}
                    <div className="row">

                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-3 text-left"><button className="btn btn-primary btn-sm waves-effect waves-light btn btn-primary" onClick={this.redirectHandler}> Back to Leads </button></div>
                                        <div className="col-6 text-center">
                                            <button type="submit" form="lead_form" className="btn btn-primary" onClick={() => this.setState({ gonext: false, })}>Save</button>  &nbsp;
                                {this.renderSubmitAndNextButton()}
                                        </div>
                                        <div className="col-3 text-right">{this.renderPrevNavigationButton()} {' '} {this.renderNextNavigationButton()}</div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {showSuccessAlert ?
                                        <Alert
                                            color="success"
                                            toggle={() =>
                                                this.setState({ showSuccessAlert: !this.state.showSuccessAlert })
                                            }
                                        >
                                            Lead succesfully updated.
                      </Alert> : ''}
                                    {showFailureAlert ?
                                        <Alert
                                            color="danger"
                                            toggle={() =>
                                                this.setState({ showFailureAlert: !this.state.showFailureAlert })
                                            }
                                        >
                                            <b>Error:</b> {showFailureMessage}
                                        </Alert> : ''}
                                    {this.props.error ? (
                                        <Alert color="danger">{this.props.error}</Alert>
                                    ) : null}
                                    <AvForm id="lead_form" onSubmit={this.handleSubmit} autoComplete="off">
                                        {this.generateLayout()}
                                        <button type="submit" form="lead_form" className="btn btn-primary" onClick={() => this.setState({ gonext: false, })}>Save</button>  &nbsp;
                    {this.renderSubmitAndNextButton()}
                                    </AvForm>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {this.renderRedirect()}
            </React.Fragment>
        );
    }
}

export default AddEditContact ;