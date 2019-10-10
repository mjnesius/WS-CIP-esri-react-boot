import React from "react";

import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
import {getColumnsFromFields, parseProjectData, parseDomainValues} from '../redux/selectors';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

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
    };
    

    render() {
    console.log("this.props.selectedFeature['Project_Name']", this.props.selectedFeature['Project_Name']);
      return (
          <Container>
              <Form>
                  <Form.Row>
                      <Form.Group as={Col} controlId="formProjectName">
                          <Form.Label>Project Name</Form.Label>
                          <Form.Control type="text" placeholder={this.props.selectedFeature['Project_Name']} />
                      </Form.Group>
                  </Form.Row>
              </Form>
          </Container>
      )
    }
  }
  
  // selector functions to reshape the state
const mapStateToProps = state => ({
    selectedFeature: state.map.selectedFeature,
    domains: parseDomainValues(state)
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...attributeActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { context: StoreContext })(ProjectDetails);