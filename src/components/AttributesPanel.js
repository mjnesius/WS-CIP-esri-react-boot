import React, { Component } from 'react';
//import {Tabs, Tab, Card} from 'react-bootstrap'

//import Container from 'react-bootstrap/Container';
//import { Container, Row, Col} from 'react-bootstrap';
//import { actions } from '../redux/reducers/map';
// import Dropdown from 'react-bootstrap/Dropdown'
//import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as filterActions } from '../redux/reducers/filters';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';
import{StoreContext} from "./StoreContext";

//  Components
import ProjectsTable from './ProjectsTable'
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
const Button = styled.button`
  position: absolute; right: 0;
  float: right;
  text-align: right;
  flex-grow: 2;
  justify-content: right;
  overflow-y: auto;
`;


class AttributesPanel extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     card: "projects_overview",
  // };
  //   this._onSelect = this._onSelect.bind(this)
  // }
  
  // _onSelect(link) {
  //   if(!(this.state.card === link)){
  //     console.log(this.state.card, "   ", link)
  //     this.props.setPanel(link);
  //   } 
  // }
  
  
  render() {
    //console.log(JSON.stringify(this.props.projects))
    // var project;
    // for (var proj in this.props.projects){
    //     //console.log(typeof proj);
    //     //console.log( proj);
    //     project = this.props.projects[proj];
    //     //console.log(typeof project);
    //     //console.log( project);
    //     break;
    // }
    //console.log(typeof project);
   // console.log(JSON.stringify(project.attributes))

    if (this.props.isVisible) {
      console.log("project attributes component")
      return (
        <Container>
          
          <Nav.Item> </Nav.Item>
           <Card>
          <Card.Header> 
          <Button variant="danger" onClick={() => this.props.toggleAttributes()}>X</Button> 
            <Nav variant="tabs" defaultActiveKey="projects_overview">
              <Nav.Item>
                <Nav.Link href="#projects_overview" onClick={() => this.props.setPanel("projects_overview")}>Projects Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#project_details" onClick={ () => this.props.setPanel("project_details")}>Project Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#contractors" onClick={ () => this.props.setPanel("contractors")}>Contractors</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#inspectors" onClick={() => this.props.setPanel("inspectors")}>Inspectors</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body className="overflow-y">
            <div className="overflow-y">
              {this.props.card ==="projects_overview" && <ProjectsTable/>}
            </div>
            
          </Card.Body>
        </Card>
        </Container>
       
        // <Card Header={<Button>X</Button>}  bsStyle="danger">
        //   <Tabs defaultActiveKey="projects_overview" id="attribute-tabs" >
        //     <Tab eventKey="projects_overview" title="Projects Overview">
        //       <ProjectsTable/>
        //     </Tab>
        //     <Tab eventKey="project_details" title="Project Details">
              
        //     </Tab>
        //     <Tab eventKey="contractors" title="Contractors">

        //     </Tab>
        //     <Tab eventKey="inspectors" title="Inspectors">

        //     </Tab>
        //   </Tabs>
        // </Card>
          
             
        
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
  card: state.attributes.card
});
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators({
      ...filterActions, ...mapActions, ...attributeActions
    }, dispatch);
  } 

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (AttributesPanel);