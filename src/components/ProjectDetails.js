import React from "react";
import moment from 'moment';
import SearchComponent from './SearchComponent';

import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';

import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
import {parseDomainValues, parseProjectData} from '../redux/selectors';

//import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import formValidator from '../utils/formValidator';
import validationRules from '../utils/validationRules';

import DatePicker from 'calcite-react/DatePicker'
import Form, {
    FormControl,
    FormControlLabel
} from 'calcite-react/Form';

import {Form as BootstrapForm}  from 'react-bootstrap/Form';
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
        this.state = {
            date: null,
            datePickerFocused: false,
            validation: this.validator.valid()
        }
        this._onDateChange = this._onDateChange.bind(this);
        this._onFocusChange = this._onFocusChange.bind(this);
        this._returnDomainDropdowns = this._returnDomainDropdowns.bind(this);

        
    };
    _onDateChange(date) {
        console.log("onDateChange");
        var _date = date.valueOf();
        this.setState({
            date: _date,
        });
        this.activateSaveButton();
        // if (this.props.saveButton && this.state.validation) {
        //     console.log("setSaveButton")
        //     this.props.setSaveButton()
        // }
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

    _handleChangeEvent(val) {
        console.log("_handleChangeEvent val is: ",val, "\ttarget: ", val.target);
        let stateCopy ={...this.props.selectedFeature};
        stateCopy[val.target.id] = val.target.value;
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
        
        return val.target.value;
      }

    _activateSaveButton = (event) => {
        if (this.props.saveButton && this.state.validation.isValid) {
            console.log("setSaveButton: ", this.props.saveButton, " \t event: ", event, "\n\tvalidation: ", this.state.validation);
            this.props.setSaveButton();
            console.log("\t new prop: ", this.props.saveButton)
        } else {
            this.props.setSaveButton("deactivate");
        }
    }
    _onFocusChange({ focused }) {
        this.setState({
            datePickerFocused: focused,
        })
    }
    _returnDomainDropdowns(domainName){
        let items = [];
        this.props.domains.forEach(function(_domain){
            if (!(_domain[domainName] === undefined || _domain[domainName] === null)){
                Object.keys(_domain[domainName]).forEach(function(key){
                    var _key = Object.keys(_domain[domainName][key])[0];
                    var _val = _domain[domainName][key][_key];
                    items.push( <MenuItem key ={_key} value={_key} >{ _val}</MenuItem>);
                })
            } 
        });
        return items;
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
                    <Col lg="4">
                        <Card bar="lightOrange" style={{ margin: '0px', flex: '1 1 20%', minHeight: '100%' }}>
                            <CardContent>
                                <CardTitle style={{
                                    minWidth: '120px', fontWeight: 'bolder', fontSize: '16px', textAlign: 'left',
                                    color: CalciteTheme.palette.darkBlue
                                }}> Project Info</CardTitle>
                                <Form horizontal style={{ backgroundColor: CalciteTheme.palette.lightBlue }} >
                                    <StyledFormControl horizontal >
                                        <StyledProjectLabel>Project Name</StyledProjectLabel>
                                        <TextField fullWidth id='Project_Name' type="textarea"
                                            style={{ resize: 'both', maxHeight: '100%', }}
                                            value={this._getAttribute('Project_Name')}
                                            onChange={this._handleChangeEvent.bind(this)} />
                                    </StyledFormControl>

                                    <StyledFormControl horizontal >
                                        <StyledProjectLabel>Status</StyledProjectLabel>
                                        <StyledSelect fullWidth id='Status' selectedValue={this._getAttribute('Status')}
                                            onChange={this._handleChangeEvent.bind(this)} >
                                            {this._returnDomainDropdowns('Status')}
                                        </StyledSelect>
                                    </StyledFormControl>

                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Project Type</StyledProjectLabel>
                                        <Select className="d-flex align-items-center" fullWidth
                                            id='Project_Type' selectedValue={this._getAttribute('Project_Type')}
                                            onChange={this._activateSaveButton}>
                                            {this._returnDomainDropdowns('Project_Type')}
                                        </Select>
                                    </StyledFormControl>
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Contact</StyledProjectLabel>
                                        <Select fullWidth selectedValue={this._getAttribute('Contact')}
                                            onChange={this._activateSaveButton} >
                                            {this.props.optionsManagers.map((e, key) => {
                                                return <MenuItem key={key} value={e}>{e}</MenuItem>;
                                            })}
                                        </Select>
                                    </StyledFormControl>
                                    <StyledFormControl horizontal error={validation.Contact_Phone.isInvalid} >
                                        <StyledProjectLabel >Contact Phone #</StyledProjectLabel>
                                        <TextField id='Contact_Phone' fullWidth type="text" style={{ minWidth: '80px' }}
                                            value={this._getAttribute('Contact_Phone')}
                                            onChange={this._handleChangeEvent.bind(this)} />
                                    </StyledFormControl>
                                    <StyledFormControl horizontal>
                                        <StyledProjectLabel>Create Date</StyledProjectLabel>
                                        <DatePicker
                                            id="basicDatePicker"
                                            yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                            placeholder="Create Date"
                                            date={moment(new Date(this._getAttribute('CreateDate')))}
                                            onDateChange={this._onDateChange}
                                            focused={this.state._datePickerFocused}
                                            onFocusChange={this._onFocusChange}
                                            numberOfMonths={1}
                                            isOutsideRange={() => { }}
                                            monthYearSelectionMode="MONTH_YEAR"
                                        />
                                    </StyledFormControl>
                                </Form>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col lg="4">

                        <Card bar="lightOrange" style={{ margin: '0px', flex: '1 1 20%', minHeight: '100%' }}>
                            <CardContent>
                                <CardTitle style={{
                                    minWidth: '120px', fontWeight: 'bolder', fontSize: '16px', textAlign: 'left',
                                    color: CalciteTheme.palette.lightOrange
                                }}> Utilities Involved</CardTitle>
                                <Form vertical style={{ flex: 1, backgroundColor: CalciteTheme.palette.white }}>
                                    <Row  style={{ flex: 1 }} className="align-items-center m-0 p-0">
                                        <Col sm="6" className="d-flex justify-content-center m-0 p-0">
                                            <Checkbox id='WaterWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('WaterWork') }
                                                checked={(this._getAttribute('WaterWork')=== 1) ? true: false}
                                                onChange={this._handleCheckboxEvent.bind(this)} fullWidth
                                                > Water Work
                                            </Checkbox>
                                        </Col>
                                        <Col sm="6" className="d-flex justify-content-center">
                                            <Checkbox id='SewerWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('SewerWork')}
                                                checked={(this._getAttribute('SewerWork') === 1) ? true: false}
                                                onChange={this._handleCheckboxEvent.bind(this)} fullWidth>
                                                Sewer Work
                                            </Checkbox>
                                        </Col>
                                        
                                    </Row>
                                    <Row style={{ flex: 1 }} className="align-items-center m-0 p-0">
                                        <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                            <Checkbox id='StormWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('StormWork')}
                                                checked={(this._getAttribute('StormWork') === 1)? true: false}
                                                onChange={this._handleCheckboxEvent.bind(this)} fullWidth>
                                                Storm Work
                                            </Checkbox>
                                        </Col>
                                        <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                            <Checkbox id='RoadWork' labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('RoadWork')}
                                                checked={(this._getAttribute('RoadWork') === 1)? true: false}
                                                onChange={this._handleCheckboxEvent.bind(this)} fullWidth>
                                                Road Work
                                            </Checkbox>
                                        </Col>
                                        <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                            <Checkbox id='GasWork'  labelStyle={{ fontWeight: 'bold' }}
                                                value={this._getAttribute('GasWork')}
                                                checked={(this._getAttribute('GasWork') === 1) ? true: false}
                                                onChange={this._handleCheckboxEvent.bind(this)} fullWidth>
                                                Gas Work
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col lg="4">

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
    optionsManagers: state.map.managers,
    saveButton: state.attributes.saveButton
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...attributeActions, ...mapActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { context: StoreContext })(ProjectDetails);