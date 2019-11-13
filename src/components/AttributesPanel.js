import React, { Component } from 'react';
import _ from 'underscore';
//import {Tabs, Tab, Card} from 'react-bootstrap'

//import Container from 'react-bootstrap/Container';
//import { Container, Row, Col} from 'react-bootstrap';
//import { actions } from '../redux/reducers/map';
// import Dropdown from 'react-bootstrap/Dropdown'
//import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import NavDropdown from'react-bootstrap/NavDropdown';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as filterActions } from '../redux/reducers/filters';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';
import {StoreContext} from "./StoreContext";
import {parseProjectData, parseEmployeesData, parseContractorData} from '../redux/selectors';

//  Components
import ProjectsTable from './ProjectsTable';
import ProjectDetails from './ProjectDetails';
import EmployeeAttributes from './EmployeeAttributes';
import ContractorAttributes from './ContractorAttributes';
import SaveIcon from 'calcite-ui-icons-react/SaveIcon';
import ResetIcon from 'calcite-ui-icons-react/ResetIcon';
import Button from 'calcite-react/Button';
import Tooltip from 'calcite-react/Tooltip';

import styled from 'styled-components';
const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: center;
  justify-content: center;
  overflow: scroll;
`;


class AttributesPanel extends Component {
  _handleNavigation(val) {
    this.props.setPanel(val);
    this.props.setSaveButton('deactivate');
  }
  _createDomainObj(_type){
    let codedValues = [];
    var sortedObjs ;
    if (_type.toLowerCase().indexOf('manager') > -1) {
      
    } else if (_type.toLowerCase().indexOf('inspector') > -1) {
     
    }
    else if (_type.toLowerCase().indexOf('contact') > -1) {
      
    }
    else if (_type.toLowerCase().indexOf('contract') > -1) {
      sortedObjs = _.sortBy(this.props.contractors, 'Contractor');
      // this.props.contractors.forEach(function(_man){
      //     items.push( <MenuItem key ={_man.OBJECTID} value={_man.Contractor} >{ _man.Contractor}</MenuItem>)
      // });  
      sortedObjs.forEach(function (_contract) {
        codedValues.push({
          "name": `${_contract.Contractor}`,
          "code": `${_contract.Contractor}`
        });
      });
      return {
        "type" : "codedValue", 
        "name" : "Contractor_Domain", 
        "codedValues" : codedValues
      }
    }

  }

  _handleSave() {
    switch (this.props.card){
      case 'project_details':
        var updatedFeature= [{"attributes" : this.props.selectedFeature}];
        console.log("update: ", JSON.stringify(updatedFeature));
        this.props.updateAttributes(this.props.featureURLs[0], updatedFeature);
        this.props.setSaveButton();
        break;
      case 'contractors':
        var domains = this._createDomainObj('contractors');
        console.log('NEW domains: ', domains);
        console.log('fields: ', this.props.fields);

        const newFields = this.props.fields.map((fld) => {
          console.log('contractors fld JSON:', fld.toJSON());
          var jsonFld = fld.toJSON();
          if(fld.name === 'Contractor'){
            jsonFld['domain'] = domains;
            console.log('\t new fld:', jsonFld);
          }
          return jsonFld;
        });
        console.log('new fields: ', newFields);
        var newFieldsObj = {'fields': newFields}

        var updatedContractor= [{"attributes" : this.props.selectedContractor}];
        new Promise(() => {
          this.props.updateAttributes(this.props.contractorsURL[0], updatedContractor)
        }).then(
          new Promise(() => {
            this.props.getContractors(this.props.contractorsURL[0])
        })
        ).then(
            // /updateDomains: (featureUrl, domainObj)
          this.props.updateDomains(this.props.adminURL[0], JSON.stringify(newFieldsObj))
        )
        
        // updateDomains(serviceUrl, fieldsObj)
        this.props.setSaveButton();
        
        break;
      case 'employees':
        new Promise(() => {
          this.props.updateAttributes(this.props.employeesURL[0], this.props.employees['features'])
        }).then(this.props.getEmployees(this.props.employeesURL[0]))
        this.props.setSaveButton();

        break; 
      default:
        return
    }
       
    
  }
  _clearEdits() {
    console.log("clearEdits");

    this.props.setSelected({}, 'contractors')
    this.props.setSelected({}, 'employees')
    this.props.selectFeature({}, 'projects')
    this.props.setSaveButton();

}

  render() {

    if (this.props.isVisible) {
      //console.log("project attributes component")
      return (
        <Container>
          <Row style={{ flex: 1, maxWidth: '100%'}}>
            <Col style={{ flex: 3 }}>
              <Card style={{ flex: 4 }}>
                <Card.Header className="bg-light m-1 p-1" style={{ flex: 4 }}>
                  <Row className=" mx-2 p-1">
                    <Col style={{ flex: 3 }}>
                      <Row>
                        <Nav variant="tabs" defaultActiveKey="projects_overview" style={{ justifycontent: 'right', textAlign: 'right' }}>
                          <Tooltip title="Roster View of Projects">
                            <Nav.Item style={{fontWeight: 'bolder'}}>
                              <Nav.Link onClick={() => this._handleNavigation("projects_overview")}>Projects Overview</Nav.Link>
                            </Nav.Item>
                          </Tooltip>
                          <Tooltip title="Select and Edit a Single Project">
                           <Nav.Item style={{fontWeight: 'bolder'}}>
                            <Nav.Link onClick={() => this._handleNavigation("project_details")}>Project Details</Nav.Link>
                          </Nav.Item> 
                          </Tooltip></Nav>
                          <Nav>
                          <NavDropdown  alignRight 
                            title="Edit Contractor & Employee Lists" id="nav-dropdown" >
                              
                            <Tooltip title="Manage Contractor Info">
                              <NavDropdown.Item >
                                <Nav.Link onClick={() => this._handleNavigation("contractors")}>Contractor List</Nav.Link>
                              </NavDropdown.Item>
                            </Tooltip>
                            <NavDropdown.Divider />
                            <Tooltip title="Manage Employee Info">
                              <NavDropdown.Item>
                                <Nav.Link onClick={() => this._handleNavigation("employees")}>Employee List</Nav.Link>
                              </NavDropdown.Item>
                            </Tooltip>
                          </NavDropdown>
                          
                          
                        </Nav>
                      </Row>
                    </Col>
                    <Col style={{ flex: 3, justifyContent: 'right', textAlign: 'right' }}>
                      <Tooltip title="Discard Pending Edits">
                        <Button clear disabled={this.props.saveButton} className="m-1 mx-3 p-1 px-2"
                          onClick={() => this._clearEdits()}
                          icon={<ResetIcon size={16} />}
                          iconPosition="before"
                        > Clear
                      </Button>
                      </Tooltip>
                      <Tooltip title="Save Your Edits">
                        <Button clear disabled={this.props.saveButton} className="m-1 mx-3 p-1 px-2"
                          onClick={() => this._handleSave()}
                          icon={<SaveIcon size={16} />}
                          iconPosition="before"
                        > Save
                      </Button>
                      </Tooltip>
                      <Tooltip title="Close Panel and Return to Map">
                        <Button className="m-1 mr-n3 p-1 px-2" red style={{ fontSize: 20 }}
                          onClick={() => this.props.toggleAttributes()}
                        >X
                      </Button>
                      </Tooltip>

                    </Col>
                  </Row>
                  
                </Card.Header>
                <Card.Body className="overflow-y" style={{ flex: 4 , width: '100%'}}>
                  <div className="overflow-y" style={{flex: 5}}>
                    {this.props.card === "projects_overview" && <ProjectsTable />}
                    {this.props.card === "project_details" && <ProjectDetails />}
                    {this.props.card === "employees" && <EmployeeAttributes />}
                    {this.props.card === "contractors" && <ContractorAttributes selectedContractor={this.props.selectedContractor}/>}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
    else{
      console.log("project attributes component, isVisible:" , this.props.isVisible)
        return null;
    }
  }
}

const mapStateToProps = state => ({
  projects: state.map.features,
  fields: state.map.fields, // an array of field objects
  isVisible: state.map.attributesComponent,
  card: state.attributes.card,
  adminURL: state.config.adminURL,
  featureURLs: state.config.featureURLs,
  contractorsURL: state.config.contractorsURL,
  employeesURL: state.config.employeesURL,
  saveButton: state.attributes.saveButton,
  employees: state.map.employees,
  selectedContractor: state.attributes.selectedContractor,
  selectedFeature: state.map.selectedFeature,
  contractors: parseContractorData(state),
  optionsManagers: parseEmployeesData(state, 'managers'),
  optionsContacts: parseEmployeesData(state, 'contacts'),
  optionsInspectors: parseEmployeesData(state, 'inspectors'),
});
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators({
      ...filterActions, ...mapActions, ...attributeActions
    }, dispatch);
  } 

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (AttributesPanel);