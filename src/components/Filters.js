import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
//import Container from 'react-bootstrap/Container';
//import { Container, Row, Col} from 'react-bootstrap';
//import { actions } from '../redux/reducers/map';
// import Dropdown from 'react-bootstrap/Dropdown'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'

//import Map from '../components/esri/map/Map';
// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { actions as mapActions } from '../redux/reducers/map';
import { actions as filterActions } from '../redux/reducers/filters';
//import Select, { components } from 'react-select'
import{StoreContext} from "./StoreContext";
//import { ReactReduxContext } from 'react-redux'
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


class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this._onSelect = this._onSelect.bind(this)
  }
  _onSelect(option) {
    
    if(option){
      //console.log('You selected', option.target.value, " \t", option.target);
      if (this.props.optionsStatus.indexOf(option.target.value) > -1 ||  option.target.value.indexOf("Statuses") >-1){
        this.props.setStatus(option.target.value.split('_')[0] );
        this.props.setDefExp();
      }
      else if (this.props.optionsManagers.indexOf(option.target.value) > -1 || option.target.value.indexOf("Managers")>-1) {

        this.props.setManager(option.target.value.split('_')[0] );
        this.props.setDefExp();
      } else{
        this.props.setYear(option.target.value.split('_')[0] );
        this.props.setDefExp();
      }

    }
  } 
  shouldComponentUpdate(){
    //console.log("filter component did update")
    if (typeof this.props.statuses !== 'undefined'){
      //console.log("false should update")
      return false
    }
      
    else {
      //console.log("true should update"); 
      return true
    } 
  }
  render() {
    if (typeof this.props.optionsStatus !== 'undefined') {
      console.log("filter component with drop downs")
      return (
        <Container>
          <Row  className="text-align-center" lg="auto">
            <Col >
              <Form inline>
                <Form.Label column xs="5" md="1">Filter</Form.Label>

                <Form.Control placeholder="Filter by Status" as="select" onChange={this._onSelect}>
                  <option key={"All Statuses"} value={"%_Statuses"}>All Statuses</option>
                  {this.props.optionsStatus.map((e, key) => {
                    return <option key={key} value={e}>{e}</option>;
                  })}
                </Form.Control>
                <Form.Control as="select" onChange={this._onSelect}>>
                  <option key={"All Years"} value={"%_Years"}>All Years</option>
                  {this.props.optionsYears.map((e, key) => {
                    return <option key={key} value={e}>{e}</option>;
                  })}
                </Form.Control>
                <Form.Control as="select" onChange={this._onSelect}>>
                  <option key={"All Managers"} value={"%_Managers"}>All Mangers</option>
                  {this.props.optionsManagers.map((e, key) => {
                    return <option key={key} value={e}>{e}</option>;
                  })}
                </Form.Control>
              </Form>
            </Col>
          </Row>
        </Container>
        
      );
    }
  }
}

const mapStateToProps = state => ({
  
  optionsYears:state.map.years,
  optionsStatus: state.map.statuses,
  optionsManagers: state.map.managers,
  selectedYear: state.map.selectedYear,
  selectedStatus: state.selectedStatus,
  selectedManager: state.selectedManager,
  filter: state.filter
});
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators({
      ...filterActions
    }, dispatch);
  } 

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (FilterComponent);