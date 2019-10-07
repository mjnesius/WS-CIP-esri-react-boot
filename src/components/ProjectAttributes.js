import React, { Component } from 'react';

//import Container from 'react-bootstrap/Container';
//import { Container, Row, Col} from 'react-bootstrap';
//import { actions } from '../redux/reducers/map';
// import Dropdown from 'react-bootstrap/Dropdown'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'


// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as filterActions } from '../redux/reducers/filters';

import{StoreContext} from "./StoreContext";

// Styled Components
import styled from 'styled-components';
const Container = styled.div`
  display: inline-flex;
  flex-direction: rtl;
  width: 100%;
  height: 100%;
  text-align: center;
  flex-grow: 2;
  justify-content: center;
`;


class ProjectAttributes extends Component {
  constructor(props) {
    super(props);
    this._onSelect = this._onSelect.bind(this)
  }
  _onSelect(option) {

  } 
  
  render() {
    console.log(JSON.stringify(this.props.projects))
    var project;
    for (var proj in this.props.projects){
        console.log(typeof proj);
        console.log( proj);
        project = this.props.projects[proj];
        console.log(typeof project);
        console.log( project);
        break;
    }
    console.log(typeof project);
   // console.log(JSON.stringify(project.attributes))

    if (this.props.isVisible) {
      console.log("project attributes component")
      return (
        <Container> table component
              
          
        </Container>
        
      );
    }
    else{
        return null;
    }
  }
}

const mapStateToProps = state => ({
  projects: state.map.features,
  isVisible: state.map.attributesComponent
});
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators({
      ...filterActions
    }, dispatch);
  } 

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (ProjectAttributes);