import React, { Component } from 'react';
import Search from 'calcite-react/Search';
import moment from 'moment';

//redux
import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';

import { actions as filterActions } from '../redux/reducers/filters';
import { parseContractorData, parseEmployeesData, parseDomainValues, parseProjectData } from '../redux/selectors';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';

import Panel, {
    PanelTitle,
    PanelText
  } from 'calcite-react/Panel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import DatePicker from 'calcite-react/DatePicker'
import Form, {
    FormControl,
    FormControlLabel
} from 'calcite-react/Form';
import { MenuItem } from 'calcite-react/Menu';
import TextField from 'calcite-react/TextField';
import Select from 'calcite-react/Select';
import styled from 'styled-components';
// const Container = styled.div`
//   display: inline-flex;
//   width: 100%;
//   height: 100%;
//   text-align: center;
//   flex-grow: 2;
//   justify-content: center;
//   overflow-y: auto;
// `;

  
class SearchComponent extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            inputValue: '',
            selectedItem: '',
            type:''
        }

        this.searchChanged = this.searchChanged.bind(this)
        this.clearSearch = this.clearSearch.bind(this)
        this.onUserAction = this.onUserAction.bind(this)
    }

    searchChanged(e) {
        console.log("search changed, e: ", e);
        this.setState({
            selectedItem: e,
        });
        if (this.props.type.includes('contractor')){
            const contractor = this.props.contractors.filter(item => item['Contractor'].toUpperCase().includes(e.toUpperCase()))
            console.log("contractor obj: ", contractor);
            this.props.setSelected(contractor[0], 'contractors')
        } else if (this.props.type.includes('employees')){
            const employees = this.props.employees.filter(item => item['Name'].toUpperCase().includes(e.toUpperCase()))
            console.log("employees obj: ", employees);
            this.props.setSelected(employees[0], 'employees')
        } else if (this.props.type.includes('projects')){
            const projects = this.props.projects.filter(item => item['Project_Name'].toUpperCase().includes(e.toUpperCase()))
            console.log("projects obj: ", projects);
            this.props.selectFeature(projects[0], 'projects')
        }
        
    }

    clearSearch() {
        console.log("clearSearch");
        this.setState({
            inputValue: '',
            selectedItem: '',
        })
        this.props.setSelected({}, 'contractors')
    }

    onUserAction(inputValue, selectedItemVal) {
        console.log("onUserAction, val: ", inputValue, "\tselectedItemval: ", selectedItemVal);
        this.setState({
            inputValue: inputValue,
            selectedItem: selectedItemVal,
        });
        // if (this.props.type.includes('contractor')){
        //     const contractor = this.props.contractors.filter(item => item['Contractor'].toUpperCase().includes(selectedItemVal.toUpperCase()))
        //     console.log("contractor obj: ", contractor);
        //     this.props.setSelected(contractor[0], 'contractors')
        // } else if (this.props.type.includes('employees')){
        //     const employees = this.props.employees.filter(item => item['Name'].toUpperCase().includes(selectedItemVal.toUpperCase()))
        //     console.log("employees obj: ", employees);
        //     this.props.setSelected(employees[0], 'employees')
        // } else if (this.props.type.includes('projects')){
        //     const projects = this.props.projects.filter(item => item['Project_Name'].toUpperCase().includes(selectedItemVal.toUpperCase()))
        //     console.log("projects obj: ", projects);
        //     this.props.setSelected(projects[0], 'projects')
        // }
    }
    setItems() {
        console.log("set items");
        if (this.props.type.includes('contractor')){
            return this.props.contractors.map(con => con['Contractor'])
        } else if (this.props.type.includes('employees')){
            return this.props.employess.map(emp => emp['Name'])
        } else if (this.props.type.includes('projects')){
            return this.props.projects.map(proj => proj['Project_Name'])
        }
        
    }
    setSelectItem() {
        console.log("set items");
        if (this.props.type.includes('contractor')){
            return this.props.selectedContractor;
        } else if (this.props.type.includes('employees')){
            return this.props.selectedEmployee;
        } else if (this.props.type.includes('projects')){
            return this.props.selectedProject;
        }
        
    }

    componentDidMount() {
        var item = ''
        if (this.props.type.includes('contractors')){
            item = this.props.selectedContractor['Contractor'] ? this.props.selectedContractor['Contractor'] : '';
        } else{
            item = this.props.selectedEmployee['Name'] ? this.props.selectedEmployee['Name'] : '';
        }
        this.setState({
            selectedItem: item,
        });
      }

    render() {
        var items = this.setItems();
        var selectedItem = this.setSelectItem();
        return (
            <div className="container-fluid">
                <Row > 
                    <Panel style={{flex: 1}}>
                        <Col lg="12">
                            <Search
                                inputValue={this.state.inputValue}
                                selectedItem= {selectedItem}/*{this.props.selectedContractor}*/
                                items={items} /* {this.props.contractors.map(con => con['Contractor'])} */
                                onChange={this.searchChanged}
                                onUserAction={this.onUserAction}
                                onRequestClear={this.clearSearch}
                            />
                        </Col>
                    </Panel>
                </Row>
            
            </div>
        )
    }
}

const mapStateToProps = state => ({
    employees: parseEmployeesData(state),
    contractors: parseContractorData(state),
    selectedContractor: state.attributes.selectedContractor,
    selectedEmployee: state.attributes.selectedEmployee,
    saveButton: state.attributes.saveButton,
    domains: parseDomainValues(state),
    optionsManagers: state.map.managers,
    projects: parseProjectData(state),
    selectedProject: state.map.selectedFeature,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...filterActions, ...mapActions, ...attributeActions
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (SearchComponent);