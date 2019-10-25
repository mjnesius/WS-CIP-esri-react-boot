import React, { Component } from 'react';
//import {Tabs, Tab, Card} from 'react-bootstrap'

//import Container from 'react-bootstrap/Container';
//import { Container, Row, Col} from 'react-bootstrap';
//import { actions } from '../redux/reducers/map';
// import Dropdown from 'react-bootstrap/Dropdown'
//import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as filterActions } from '../redux/reducers/filters';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';
import {StoreContext} from "./StoreContext";

//  Components
import ProjectsTable from './ProjectsTable';
import ProjectDetails from './ProjectDetails';
import EmployeeAttributes from './EmployeeAttributes';
import ContractorAttributes from './ContractorAttributes';
import SaveIcon from 'calcite-ui-icons-react/SaveIcon';
import Button from 'calcite-react/Button';

import styled from 'styled-components';
const Container = styled.div`
  display: inline-flex;
  flex-direction: rtl;
  width: 100%;
  height: 100%;
  text-align: center;
  flex-grow: 2;
  justify-content: center;
  overflow-y: auto;
`;


class AttributesPanel extends Component {
  _handleNavigation(val) {
    this.props.setPanel(val);
    this.props.setSaveButton();
  }

  _handleSave(val) {
    switch (this.props.card){
      case 'project_details':
        this.props.updateAttributes(this.props.featureURLs[0], this.props.projects)
        this.props.setSaveButton();
        break;
      case 'contractors':
        this.props.updateAttributes(this.props.contractorsURL[0], this.props.selectedContractor)
        this.props.setSaveButton();
        break;
      case 'employees':
          this.props.updateAttributes(this.props.employeesURL[0], this.props.selectedEmployee)
          this.props.setSaveButton();
          break; 
      default:
        return
    }
       
    
  }

  render() {

    if (this.props.isVisible) {
      //console.log("project attributes component")
      return (
        <Container>
          <Row style={{ flex: 1 }}>
            <Col style={{ flex: 3 }}>
              <Card style={{ flex: 4 }}>
                <Card.Header className="bg-light m-1 p-1" style={{ flex: 4 }}>
                  <Row className=" mx-2 p-1">
                    <Col style={{ flex: 3 }}>
                      <Row>
                        <Nav variant="tabs" defaultActiveKey="projects_overview" style={{ justifycontent: 'right', textAlign: 'right' }}>
                          <Nav.Item>
                            <Nav.Link onClick={() => this._handleNavigation("projects_overview")}>Projects Overview</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link onClick={() => this._handleNavigation("project_details")}>Project Details</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link onClick={() => this._handleNavigation("contractors")}>Contractors</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link onClick={() => this._handleNavigation("employees")}>Employees</Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </Row>
                    </Col>
                    <Col style={{ flex: 3, justifyContent: 'right', textAlign: 'right' }}>
                      <Button clear disabled={this.props.saveButton} className="m-1 mx-3 p-1 px-2"
                        onClick={() => this.props.updateAttributes(this.props.featureURLs[0], this.props.projects)}
                        icon={<SaveIcon size={16} />}
                        iconPosition="before"> Save
                    </Button>
                      <Button className="m-1 mr-n3 p-1 px-2" red style={{ fontSize: 20 }} onClick={() => this.props.toggleAttributes()}>X</Button>
                    </Col>
                  </Row>
                  
                </Card.Header>
                <Card.Body className="overflow-y" style={{ flex: 4 }}>
                  <div className="overflow-y" style={{ flex: 5 }}>
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
  isVisible: state.map.attributesComponent,
  card: state.attributes.card,
  featureURLs: state.config.featureURLs,
  contractorsURL: state.config.contractorsURL,
  employeesURL: state.config.employeesURL,
  saveButton: state.attributes.saveButton,
  selectedEmployee: state.attributes.selectedEmployee,
  selectedContractor: state.attributes.selectedContractor,
});
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators({
      ...filterActions, ...mapActions, ...attributeActions
    }, dispatch);
  } 

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (AttributesPanel);