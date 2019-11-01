import React from "react";
import moment from 'moment';
import SearchComponent from './SearchComponent';

import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';

import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
import {parseDomainValues, parseProjectData, parseEmployeesData, parseContractorData} from '../redux/selectors';

//import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import formValidator from '../utils/formValidator';
import validationRules from '../utils/validationRules';

import DatePicker from 'calcite-react/DatePicker'
import Form, {
    FormControl,
    FormControlLabel, FormHelperText
} from 'calcite-react/Form';

//import {FormControl as BootstrapFormControl}  from 'react-bootstrap/FormControl';
// , { PanelTitle, PanelText } 
import { ThemeContext } from 'styled-components';
import { CalciteTheme } from 'calcite-react/CalciteThemeProvider';
//import Panel from 'calcite-react/Panel';
import { MenuItem } from 'calcite-react/Menu';
import TextField from 'calcite-react/TextField';
import Select from 'calcite-react/Select';
import Checkbox from 'calcite-react/Checkbox';
import Card, {
    CardTitle,
    CardContent
  } from 'calcite-react/Card'
//import Card from 'react-bootstrap/Card';

import styled from 'styled-components';
const StyledProjectLabel = styled(FormControlLabel)`
    color: black;
    text-shadow: 0px 0px 2px white;
    font-weight: bolder;
    margin-left: 1;
    width: 110px !important;
    height: 65px;
    text-align: left;
  `;
 const StyledFormControl = styled(FormControl)`
    width: 98%;
    margin: 1;
    margin-left: 2;
    align-items: center !important;
    justify-content: between !important
    height: 65px;
`;
const StyledSelect = styled(Select)`
    width: 98%;
    margin-left: 2;
    height: 65px;
    align-items: center !important;
`;
const StyledDatePicker = styled(DatePicker)`
    width: 98%;
    margin-left: 2;
    height: 65px;
    align-items: center !important;
`;
//import styled from 'styled-components';
// const Container = styled.div`
//   display: inline-flex;
//   flex-direction: rtl;
//   width: 100%;
//   height: 100%;
//   flex-grow: 2;
//   class-name: container-fluid
// `;

class ProjectDetails extends React.Component {
    constructor(props) {
        super();
        // TO-DO refactor to use Redux state
        this.validator = new formValidator(validationRules);
        this.state = {/* 
            Let_Date: null,
            PreBid_Date: null,
            BidOpening_Date: null,
            PreCon_Date: null, */
            Let_DatePicker: false, 
            PreBid_DatePicker: false,
            BidOpening_DatePicker: false, 
            PreCon_DatePicker: false,
            Const_Start_Date_NTPPicker: false,
            Const_End_DatePicker: false,
            validation: this.validator.valid()
        }
        this._onDateChange = this._onDateChange.bind(this);
        this._onFocusChange = this._onFocusChange.bind(this);
        this._returnDomainDropdowns = this._returnDomainDropdowns.bind(this);

        
    };
    _onDateChange(date, id) {
        console.log("onDateChange date: ", date._d, "  date._d.valueOf(): ", date._d.valueOf(), " id: ", id);
        var _date = date._d.valueOf();
        let stateCopy ={...this.props.selectedFeature};
        stateCopy[id] = _date;
        this.props.selectFeature(stateCopy);
        // this.setState({
        //     [id]: _date,
        // });
        this._activateSaveButton();
        // if (this.props.saveButton && this.state.validation) {
        //     console.log("setSaveButton")
        //     this.props.setSaveButton()
        // }
    }
    _onFocusChange(e, id='') {
        console.log("date picker focus change: ", e, " id: ", id);
        console.log("before this.state: ", this.state);
        this.setState({
            [id]: e.focused,
        });
        console.log("after this.state: ", this.state);
    }

    _handleCheckboxEvent(val) {
        console.log("_handleCheckboxEvent val is: ",val, "\ttarget: ", val.target);
        console.log("_handleCheckboxEvent val.target.id is: ",val.target.id, "\tval.target.value: ", val.target.value);
        let stateCopy ={...this.props.selectedFeature};
        console.log("old: ", stateCopy[val.target.id] ,"  new ",val.target.id, " is: ", (stateCopy[val.target.id] > 0) ? 0 : 1);
        stateCopy[val.target.id] = (stateCopy[val.target.id] > 0) ? 0 : 1;
        this.props.selectFeature(stateCopy);
        let validation = this.validator.validate(stateCopy);
        console.log("validation: ", validation, "\n\tthis.state.validation: ", this.state.validation);
        this.setState({
            validation: validation
            }, () => { this._activateSaveButton(); }
        );
        
        return val.target.value;
      }

    _handleChangeEvent(val, target) {
        console.log("_handleChangeEvent val is: ",val, "\ttarget: ", target);
        let stateCopy ={...this.props.selectedFeature};
        stateCopy[target] = val;
        // val['Contractor']
        // this.setState({          
        //     ..,
        //     contractor: this.props.selectedContractor['Contractor'] ? this.props.selectedContractor['Contractor'] : ""
        // });
        //this.props.setSelected(stateCopy, 'projects')
        this.props.selectFeature(stateCopy);
        let validation = this.validator.validate(stateCopy);
        console.log("validation: ", validation, "\n\tthis.state.validation: ", this.state.validation);
        this.setState({
            validation: validation
            }, () => { this._activateSaveButton(); }
        );
        //console.log( "this.state.validation: ", this.state.validation);
        
        return val;
      }

    _activateSaveButton = (event) => {
        //&& this.state.validation.isValid
        if (this.props.saveButton ) {
            console.log("setSaveButton: ", this.props.saveButton, " \t event: ", event, "\n\tvalidation: ", this.state.validation);
            this.props.setSaveButton();
            console.log("\t new prop: ", this.props.saveButton)
        } else {
            this.props.setSaveButton("deactivate");
        }
    }
    
    _returnDomainDropdowns(_field){
        let items = [];
        //var domainName = _field + '_Domain';
        const match = this.props.domains.filter((_dom) => {
            //console.log("_man: ", _man);
            return Object.keys(_dom)[0].indexOf( _field) > -1;
        });
        //console.log("domain dropdown, match: ", match  );

        if (!(match === undefined || match === null)) {
            //var codedVals = Object.keys(match)[0];
            var domainObj = match[0]
            //console.log("domain dropdown, \n\t  domainObj: ", domainObj);
            var domainName = Object.keys(domainObj)[0];
            //console.log("domainName: ", domainName, " domainObj[domainName]");
            if (!(domainObj === undefined || domainObj === null)) {
                Object.keys(domainObj[domainName]).forEach(function (codedValObj) {
                    var _key = Object.keys(domainObj[domainName][codedValObj])[0];
                    var _val = domainObj[domainName][codedValObj][_key];
                    //console.log("codedValObj: ", codedValObj, "  _key: ", _key, "  _val: ", _val);
                    items.push(<MenuItem key={_key} value={_key} >{_val}</MenuItem>);
                })
            }
            return items;
        }
       
        console.log(" no domain match for: ", _field)
        return items;
    }

    _returnValuesDropdowns(_type){
        let items = [];
        if (_type.indexOf('manager') > -1){
            this.props.optionsManagers.forEach(function(_man){
                items.push( <MenuItem key ={_man.OBJECTID} value={_man.Name} >{ _man.Name}</MenuItem>)
            });   
        } else if (_type.indexOf('inspector') > -1){
            this.props.optionsInspectors.forEach(function(_man){
                items.push( <MenuItem key ={_man.OBJECTID} value={_man.Name} >{ _man.Name}</MenuItem>)
            });   
        }
        else if (_type.indexOf('contact') > -1){
            this.props.optionsContacts.forEach(function(_man){
                items.push( <MenuItem key ={_man.OBJECTID} value={_man.Name} >{ _man.Name}</MenuItem>)
            });   
        }
        return items;
    }

    _getRelatedAttribute(_type, _getFld, _matchFld, _matchVal) {
        var val;
        var fld =_getFld;
        //OfficeNumber, CellNumber
        console.log("_getRelatedAttribute, _type: ", _type, "  _getFld: ", _getFld, " _matchFld: ", _matchFld, "  _matchVal: ", _matchVal);
        if (_type.indexOf('contact') > -1){
            const match = this.props.optionsContacts.filter((_man) => {
                //console.log("_man: ", _man);
                return _man[_matchFld] === _matchVal;
            });
            console.log("related match: ", match);
            var _match = match[0] ? match[0] : {};
            val = _match[fld] ? _match[fld] : ''
        } 
        return val;  
    }

    _getAttribute(fld) {
        return this.props.selectedFeature[fld] ? this.props.selectedFeature[fld]: ''
    }

    // Dates  var event = new Date(1361923200000); ==> toString() Tue Feb 26 2013 19:00:00 GMT-0500 (Eastern Standard Time)

    render() {
        let validation = this.validator.validate(this.props.selectedFeature);
        console.log("render's validation: ", validation) 
        return (
            <div className="container-fluid" style={{ padding: "0px", backgroundColor: "transparent" }}>
                <Row >
                    <Col lg="12">
                        <FormControlLabel style={{ minWidth: '120px', fontWeight: "bolder", fontSize: "17px", textAlign: "left", color: CalciteTheme.palette.blue }}>
                            Select a Project
                        </FormControlLabel>
                        <SearchComponent type='projects' />
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col lg="8">
                        <Card bar="darkBlue" style={{ margin: '0px', flex: '1 1 20%', minHeight: '100%' }}>
                            <CardContent>
                                <CardTitle style={{
                                    minWidth: '120px', fontWeight: 'bolder', fontSize: '16px', textAlign: 'left',
                                    color: CalciteTheme.palette.darkBlue
                                }}> Project Info</CardTitle>
                                <Form horizontal style={{ backgroundColor: CalciteTheme.palette.lightBlue, paddingTop: '1px' }} >
                                    <Col lg="8">
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Project Name</StyledProjectLabel>
                                        <TextField fullWidth id='Project_Name' type="textarea"
                                            style={{ resize: 'both', maxHeight: '100%', }}
                                            value={!(Object.keys(this.props.selectedFeature).length > 0) ? 
                                                " Search and Select a Project.       Use the Map to Create New Projects" : 
                                                this._getAttribute('Project_Name')}
                                            onChange={this._handleChangeEvent.bind(this)} 
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}/>
                                    </StyledFormControl>

                                    <StyledFormControl horizontal error={validation.Status.isInvalid}>
                                        <StyledProjectLabel>Status</StyledProjectLabel>
                                        <StyledSelect fullWidth id='Status' selectedValue={this._getAttribute('Status')}
                                            onChange={(e) => this._handleChangeEvent(e, 'Status')}
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            /* onChange={this._handleChangeEvent.bind(this)} */ >
                                            {this._returnDomainDropdowns('Status')}
                                        </StyledSelect>
                                    </StyledFormControl>

                                    <StyledFormControl horizontal error={validation.Project_Manager.isInvalid}>
                                        <StyledProjectLabel>Project Manager</StyledProjectLabel>
                                        <Select className="d-flex align-items-center" fullWidth
                                            id='Project_Manager' selectedValue={this._getAttribute('Project_Manager')}
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            onChange={(e) => this._handleChangeEvent(e, 'Project_Manager')}>
                                            {this._returnValuesDropdowns('manager')}
                                        </Select>
                                    </StyledFormControl>
                                    <StyledFormControl horizontal error={validation.Project_Type.isInvalid}>
                                        <StyledProjectLabel>Project Type</StyledProjectLabel>
                                        <Select className="d-flex align-items-center" fullWidth
                                            id='Project_Type' selectedValue={this._getAttribute('Project_Type')}
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            onChange={(e) => this._handleChangeEvent(e, 'Project_Type')}>
                                            {this._returnDomainDropdowns('Project_Type')}
                                        </Select>
                                    </StyledFormControl>
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Contact</StyledProjectLabel>
                                        <Select fullWidth className="d-flex align-items-center"
                                            id='Contact' selectedValue={this._getAttribute('Contact')}
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            onChange={(e) => this._handleChangeEvent(e, 'Contact')}
                                            /* onChange={this._activateSaveButton} */ >
                                            {this._returnValuesDropdowns('contact')}
                                        </Select>
                                    </StyledFormControl>
                                    <StyledFormControl horizontal  error={validation.Contact_Phone.isInvalid}  >
                                        <StyledProjectLabel >Contact Phone #</StyledProjectLabel>
                                        <TextField fullWidth id='Contact' type="text"
                                            value={this._getRelatedAttribute('contact', 'CellNumber', 'Name', this._getAttribute('Contact'))} 
                                            onChange={this._handleChangeEvent.bind(this)} 
                                            disabled={true}/>
                                        {validation.Contact_Phone.isInvalid ?  <FormHelperText className="d-flex align-items-center"> {validation.Contact_Phone.message}</FormHelperText>: null}
                                    </StyledFormControl>
                                    </Col>
                                    <Col lg="4">
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Pre Bid Date</StyledProjectLabel>
                                        <StyledDatePicker
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            id="PreBid_DatePicker"
                                            yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                            date={this._getAttribute('PreBid_Date') ? new moment(new Date(this._getAttribute('PreBid_Date'))) : undefined}
                                            onDateChange={(e) => this._onDateChange(e, "PreBid_Date")}
                                            focused={this.state.PreBid_DatePicker}
                                            onFocusChange={ (e) => this._onFocusChange(e, 'PreBid_DatePicker')}
                                            numberOfMonths={1}
                                            isOutsideRange={() => { }}
                                            monthYearSelectionMode="MONTH_YEAR"
                                        />
                                    </StyledFormControl>
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Bid Opening Date</StyledProjectLabel>
                                        <StyledDatePicker
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            id="BidOpening_DatePicker"
                                            yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                            date={this._getAttribute('BidOpening_Date') ? new moment(new Date(this._getAttribute('BidOpening_Date'))) : undefined}
                                            onDateChange={(e) => this._onDateChange(e, "BidOpening_Date")}
                                            focused={this.state.BidOpening_DatePicker}
                                            onFocusChange={(e) => this._onFocusChange(e, 'BidOpening_DatePicker')}
                                            numberOfMonths={1}
                                            isOutsideRange={() => { }}
                                            monthYearSelectionMode="MONTH_YEAR"
                                        />
                                    </StyledFormControl>
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Pre Con Date</StyledProjectLabel>
                                        <StyledDatePicker
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            id="PreCon_DatePicker"
                                            yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                            date={this._getAttribute('PreCon_Date') ? new moment(new Date(this._getAttribute('PreCon_Date'))) : undefined}
                                            onDateChange={(e) => this._onDateChange(e, "PreCon_Date")}
                                            focused={this.state.PreCon_DatePicker}
                                            onFocusChange={(e) => this._onFocusChange(e, 'PreCon_DatePicker')}
                                            numberOfMonths={1}
                                            isOutsideRange={() => { }}
                                            monthYearSelectionMode="MONTH_YEAR"
                                        />
                                    </StyledFormControl>
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Let Date</StyledProjectLabel>
                                        <StyledDatePicker
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            id="Let_DatePicker"
                                            yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                            date={this._getAttribute('Let_Date') ? new moment(new Date(this._getAttribute('Let_Date'))) : undefined}
                                            onDateChange={(e) => this._onDateChange(e, "Let_Date")}
                                            focused={this.state.Let_DatePicker}
                                            onFocusChange={(e) => this._onFocusChange(e, 'Let_DatePicker')}
                                            numberOfMonths={1}
                                            isOutsideRange={() => { }}
                                            monthYearSelectionMode="MONTH_YEAR"
                                        />
                                    </StyledFormControl>
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Construction NTP</StyledProjectLabel>
                                        <StyledDatePicker
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            id="Const_Start_Date_NTPPicker"
                                            yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                            date={this._getAttribute('Const_Start_Date_NTP') ? new moment(new Date(this._getAttribute('Const_Start_Date_NTP'))) : undefined}
                                            onDateChange={(e) => this._onDateChange(e, "Const_Start_Date_NTP")}
                                            focused={this.state.Const_Start_Date_NTPPicker}
                                            onFocusChange={(e) => this._onFocusChange(e, 'Const_Start_Date_NTPPicker')}
                                            numberOfMonths={1}
                                            isOutsideRange={() => { }}
                                            monthYearSelectionMode="MONTH_YEAR"
                                        />
                                    </StyledFormControl>
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Const End Date</StyledProjectLabel>
                                        <StyledDatePicker
                                            disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            id="Const_End_DatePicker"
                                            yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                            date={this._getAttribute('Const_End_Date') ? new moment(new Date(this._getAttribute('Const_End_Date'))) : undefined}
                                            onDateChange={(e) => this._onDateChange(e, "Const_End_Date")}
                                            focused={this.state.Const_End_DatePicker}
                                            onFocusChange={(e) => this._onFocusChange(e, 'Const_End_DatePicker')}
                                            numberOfMonths={1}
                                            isOutsideRange={() => { }}
                                            monthYearSelectionMode="MONTH_YEAR"
                                        />
                                    </StyledFormControl>
                                    </Col>
                                </Form>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card bar="lightOrange" style={{ margin: '0px', flex: '1 1 20%'}}>
                            <CardContent>
                                <CardTitle style={{
                                    minWidth: '120px', fontWeight: 'bolder', fontSize: '16px', textAlign: 'left',
                                    color: CalciteTheme.palette.lightOrange
                                }}> Utilities Involved</CardTitle>
                                <Form vertical style={{ flex: 1, backgroundColor: CalciteTheme.palette.white }}>
                                    <Row style={{ flex: 1 }} className="align-items-center m-0 p-0">
                                        <Col sm="6" className="d-flex justify-content-center m-0 p-0">
                                            <Checkbox id='WaterWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('WaterWork')}
                                                checked={(this._getAttribute('WaterWork') === 1) ? true : false}
                                                onChange={this._handleCheckboxEvent.bind(this)} 
                                                fullWidth
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            > Water Work
                                            </Checkbox>
                                        </Col>
                                        <Col sm="6" className="d-flex justify-content-center">
                                            <Checkbox id='SewerWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('SewerWork')}
                                                checked={(this._getAttribute('SewerWork') === 1) ? true : false}
                                                onChange={this._handleCheckboxEvent.bind(this)} 
                                                fullWidth
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                > Sewer Work
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                    <Row style={{ flex: 1 }} className="align-items-center m-0 p-0">
                                        <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                            <Checkbox id='StormWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('StormWork')}
                                                checked={(this._getAttribute('StormWork') === 1) ? true : false}
                                                onChange={this._handleCheckboxEvent.bind(this)} 
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                fullWidth
                                                > Storm Work
                                            </Checkbox>
                                        </Col>
                                        <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                            <Checkbox id='RoadWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('RoadWork')}
                                                checked={(this._getAttribute('RoadWork') === 1) ? true : false}
                                                onChange={this._handleCheckboxEvent.bind(this)}  
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                fullWidth
                                                > Road Work
                                            </Checkbox>
                                        </Col>
                                        <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                            <Checkbox id='GasWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('GasWork')}
                                                checked={(this._getAttribute('GasWork') === 1) ? true : false}
                                                onChange={this._handleCheckboxEvent.bind(this)} 
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                fullWidth
                                                >
                                                Gas Work
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardContent>
                        </Card>
                    </Col>
                </Row>

            </div>
        )
    }
}
ProjectDetails.contextType = ThemeContext;

  // selector functions to reshape the state
const mapStateToProps = state => ({
    selectedFeature: state.map.selectedFeature,
    projects: parseProjectData(state),
    domains: parseDomainValues(state),
    optionsManagers: parseEmployeesData(state, 'managers'),//state.map.managers,
    optionsContacts: parseEmployeesData(state, 'contacts'),
    optionsInspectors: parseEmployeesData(state, 'inspectors'),
    employees: parseEmployeesData(state, 'all'),
    contractors: parseContractorData(state),
    saveButton: state.attributes.saveButton
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...attributeActions, ...mapActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { context: StoreContext })(ProjectDetails);