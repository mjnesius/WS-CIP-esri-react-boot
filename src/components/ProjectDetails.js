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

import DatePicker from 'calcite-react/DatePicker'
import Form, {
    FormControl,
    FormControlLabel
} from 'calcite-react/Form';
import Panel, {
    PanelTitle,
    PanelText
  } from 'calcite-react/Panel';
import { MenuItem } from 'calcite-react/Menu';
import TextField from 'calcite-react/TextField';
import Select from 'calcite-react/Select';

import styled from 'styled-components';
const Container = styled.div`
  display: inline-flex;
  flex-direction: rtl;
  width: 100%;
  height: 100%;
  flex-grow: 2;
`;

class ProjectDetails extends React.Component {
    constructor(props) {
        super();
        // TO-DO refactor to use Redux state
        this.state = {
            date: null,
            datePickerFocused: false,
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
        
        this._returnDomainDropdowns = this._returnDomainDropdowns.bind(this)
    };
    onDateChange(date) {
        var _date = date.valueOf();
        this.setState({
            date: _date,
        });
        if (this.props.saveButton) {
            console.log("setSaveButton")
            this.props.setSaveButton()
        }
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
        this.activateSaveButton();
        return val.target.value;
      }

    activateSaveButton = (event) => {
        if (this.props.saveButton) {
            console.log("setSaveButton: ", this.props.saveButton, " \t event: ", event);
            this.props.setSaveButton();
            console.log("\t new prop: ", this.props.saveButton)
        }
    }
    onFocusChange({ focused }) {
        this.setState({
            datePickerFocused: focused,
        })
    }
    _returnDomainDropdowns(domainName){
        let items = [];
        this.props.domains.forEach(function(_domain){
            
            if (!(_domain[domainName] === undefined || _domain[domainName] === null)){
                //console.log("_return domain ", JSON.stringify(_domain[domainName]) );
                Object.keys(_domain[domainName]).forEach(function(key){
                    var _key = Object.keys(_domain[domainName][key])[0];
                    var _val = _domain[domainName][key][_key];
                    //console.log("\t returning option with key: ", _key , "\tand value: " , _val);
                    items.push( <MenuItem key ={_key} value={_key} >{ _val}</MenuItem>);
                })
                
            } else {
                //console.log("\t domain ", JSON.stringify(_domain), "\t doesn't match\t", domainName )
            }
        });
        return items;
    }
    // Dates  var event = new Date(1361923200000); ==> toString() Tue Feb 26 2013 19:00:00 GMT-0500 (Eastern Standard Time)

    render() {
        //console.log("this.props.selectedFeature['Project_Name']", this.props.selectedFeature['Project_Name']);
        //console.log("this.props.selectedFeature['Status']", this.props.selectedFeature['Status']);
        return (
            <Container>
                <Row > 
                    <Panel style={{flex: 1}}>
                        <Col lg="12">
                            <SearchComponent type='projects'/>
                        </Col>
                    </Panel>
                </Row>
                <Form horizontal style={{flex: 1}}>
                    <Row style={{flex: 1}}>
                        <Col sm="4">
                            <FormControl >
                                <FormControlLabel style={{ minWidth: '160px' }}>Project Name</FormControlLabel>
                                <TextField id='Project_Name' fullWidth type="textarea" style={{maxWidth: '100%', resize: "both" }} 
                                    value={this.props.selectedFeature['Project_Name']}
                                    onChange={this._handleChangeEvent.bind(this)}/>
                            </FormControl>
                        </Col>
                        <Col sm="4">
                                    <FormControl>
                                        <FormControlLabel style={{ minWidth: '120px' }}>Status</FormControlLabel>
                                        <Select id='Status' selectedValue={this.props.selectedFeature['Status']} onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                            {this._returnDomainDropdowns('Status')}
                                        </Select>
                                    </FormControl>
                        </Col>
                        <Col sm="4">
                            <FormControl >
                                <FormControlLabel style={{ minWidth: '140px' }}>Project Type</FormControlLabel>
                                <Select id ='Project_Type' selectedValue={this.props.selectedFeature['Project_Type']} onChange={this.activateSaveButton} fullWidth>
                                {this._returnDomainDropdowns('Project_Type')}
                                </Select>
                            </FormControl>
                        </Col>
                        <Col sm="4">
                            <FormControl>
                                <FormControlLabel style={{ minWidth: '120px' }}>Contact</FormControlLabel>
                                <Select selectedValue={this.props.selectedFeature['Contact']} onChange={this.activateSaveButton} fullWidth>
                                    {this.props.optionsManagers.map((e, key) => {
                                    return <MenuItem key={key} value={e}>{e}</MenuItem>;
                                })} 
                                </Select>
                            </FormControl>
                        </Col>
                        <Col sm="4">
                        <FormControl>
                            <FormControlLabel style={{ minWidth: '120px' }}>CreateDate</FormControlLabel>
                            <DatePicker
                                id="basicDatePicker"
                                yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year',10).year() }}
                                placeholder="Create Date"
                                date={moment(new Date(this.props.selectedFeature['CreateDate']))}
                                onDateChange={this.onDateChange}
                                focused={this.state.datePickerFocused}
                                onFocusChange={this.onFocusChange}
                                numberOfMonths={1}
                                isOutsideRange={() => {}}
                                monthYearSelectionMode="MONTH_YEAR"
                            />
                        </FormControl>
                        
                        </Col>
                    </Row>
                </Form>
            </Container>
        )
    }
}
  
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