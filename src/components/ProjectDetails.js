import React from "react";
import moment from 'moment';
//import year from 'moment/year';
import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
import {parseDomainValues} from '../redux/selectors';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import DatePicker from 'calcite-react/DatePicker'
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
        })
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
                console.log("_return domain ", JSON.stringify(_domain[domainName]) );
                Object.keys(_domain[domainName]).forEach(function(key){
                    var _key = Object.keys(_domain[domainName][key])[0];
                    var _val = _domain[domainName][key][_key];
                    console.log("\t returning option with key: ", _key , "\tand value: " , _val);
                    items.push( <option key={_key} >{ _val}</option>);
                })
                
            } else {
                console.log("\t domain ", JSON.stringify(_domain), "\t doesn't match\t", domainName )
            }
        });
        return items;
    }
    // Dates  var event = new Date(1361923200000); ==> toString() Tue Feb 26 2013 19:00:00 GMT-0500 (Eastern Standard Time)

    render() {
        console.log("this.props.selectedFeature['Project_Name']", this.props.selectedFeature['Project_Name']);
        console.log("this.props.selectedFeature['Status']", this.props.selectedFeature['Status']);
        return (
            <Container>
                <Form style={{flex: 1}}>
                    <Form.Group as={Row} controlId="formProjectName">
                        <Form.Label column sm="2">Project Name</Form.Label>
                        <Col sm="4">
                            <Form.Control type="text" placeholder={this.props.selectedFeature['Project_Name']} />
                        </Col>
                        <Form.Label column sm="2">Status</Form.Label>
                        <Col sm="4">
                            <Form.Control as="select">
                                <option key={this.props.selectedFeature['Status']}>{this.props.selectedFeature['Status']}</option>
                                {this._returnDomainDropdowns('Status')}
                            </Form.Control>
                        </Col>
                        <Form.Label column sm="2">Project Type</Form.Label>
                        <Col sm="4">
                            <Form.Control column sm="4" as="select">
                                <option key={this.props.selectedFeature['Project_Type']}>{this.props.selectedFeature['Project_Type']}</option>
                                {this._returnDomainDropdowns('Project_Type')}
                            </Form.Control>
                        </Col>
                        <Form.Label column sm="2">Contact</Form.Label>
                        <Col sm="4">
                            <Form.Control as="select">
                                <option key={this.props.selectedFeature['Contact']}>{this.props.selectedFeature['Contact']}</option>
                                {this.props.optionsManagers.map((e, key) => {
                                    return <option key={key} value={e}>{e}</option>;
                                })}
                            </Form.Control>
                        </Col>
                        <Form.Label column sm="2">CreateDate</Form.Label>
                        <Col sm="4">
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
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}
  
  // selector functions to reshape the state
const mapStateToProps = state => ({
    selectedFeature: state.map.selectedFeature,
    domains: parseDomainValues(state),
    optionsManagers: state.map.managers
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...attributeActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { context: StoreContext })(ProjectDetails);