import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
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
import { actions as filterActions } from '../redux/reducers/filter';
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
    this.state = {
      // optionsYears:this.props.years,
      // optionsStatus: this.props.statuses,
      // optionsManagers: this.props.managers,
      optionsYears:[],
      optionsStatus: [],
      optionsManagers: [],
      selectedYear: "",
      selectedStatus: "",
      selectedManager: "",
      filter: ""
    }
    this._onSelect = this._onSelect.bind(this)
  }
  _onSelect(option) {
    
    if(option){
      console.log('You selected', option.target.value, " \t", option.target);
      if (this.props.optionsStatus.indexOf(option.target.value) > -1 ||  option.target.value.indexOf("Statuses") >-1){
        console.log("hello from filter status");
        this.setState({
          selectedStatus: option.target.value.split('_')[0] 
        });
        this.props.setStatus(option.target.value.split('_')[0] );
      }
      /* if (this.props.years.indexOf(option.target.value.toString()) > -1) {
        console.log("hello from filter years");
        this.setState({ selectedYear: option.target.value });
      } */
      else if (this.props.optionsManagers.indexOf(option.target.value) > -1 || option.target.value.indexOf("Managers")>-1) {
        console.log("hello from filter managers");
        this.setState({ selectedManager: option.target.value.split('_')[0]  });
        this.props.setManager(option.target.value.split('_')[0] );
      } else{
        console.log("hello from filter years");
        this.setState({ selectedYear: option.target.value.split('_')[0] });
        this.props.setYear(option.target.value.split('_')[0] );
      }

    }
    
   var stat = this.state.selectedStatus ? this.state.selectedStatus : "";
    var man = this.state.selectedManager ? this.state.selectedManager : "";
    var yr = this.state.selectedYear ? this.state.selectedYear : "";
    var newFilter = "Status Like '%" + stat + "%' & Project_Manager Like '%" + man + "%' & Proposed_Year Like '%" + yr +"%'";
    this.setState({ filter: newFilter});
    //console.log(newFilter);
    //this.props.onSetFilters(newFilter);
    //this.props.store.dispatch(mapActions.setFilter(newFilter));
    //console.log(this.getState());
  } 
  shouldComponentUpdate(){
    //console.log("filter component did update")
    if (typeof this.props.statuses !== 'undefined'){
      console.log("false should update")
      return false
    }
      
    else {
      console.log("true should update"); 
      return true
    } 
  }
  componentDidUpdate(){
    console.log("filter component did update")
    if (typeof this.props.optionsStatus !== 'undefined') {
      var _statuses = [];
      this.props.optionsStatus.sort();
      //console.log("optionsStatus ", JSON.stringify(this.props.optionsStatus))
      //this.props.statuses.length
      for (var i = 0; i < this.props.optionsStatus.length; i++) {
        _statuses.push({
          label: this.props.optionsStatus[i],
          value: this.props.optionsStatus[i]
        });
      }

      this.props.optionsYears.sort();
      var _years = [];
      for (i = 0; i < this.props.optionsYears.length; i++) {
        _years.push({
          label: this.props.optionsYears[i],
          value: this.props.optionsYears[i]
        });
      }

      this.props.optionsManagers.sort();
      var _man = [];
      for (i = 0; i < this.props.optionsManagers.length; i++) {
        _man.push({
          label: this.props.optionsManagers[i],
          value: this.props.optionsManagers[i]
        });
      }
    }
    if(typeof this.props.optionsStatus !== 'undefined'){
      console.log("returning  updated filter component")
      return (
          <Container className="fixed-bottom" >
            
              <Form inline>
                <Form.Group controlId="form.Filter">
                  <Form.Label>Filter</Form.Label>
                  <Form.Control placeholder="Filter by Status" as="select" onChange={this._onSelect}>
                  
                    {this.props.optionsStatus.map((e, key) => {
                      return <option key={key} value={e}>{e}</option>;
                    })}
                  </Form.Control>
                  <Form.Control as="select" onChange={this._onSelect}>>
                {this.props.optionsYears.map((e, key) => {
                    return <option key={key} value={e}>{e}</option>;
                  })}
                  </Form.Control>
                  <Form.Control as="select" onChange={this._onSelect}>>
                {this.props.optionsManagers.map((e, key) => {
                    return <option key={key} value={e}>{e}</option>;
                  })}
                  </Form.Control>
                </Form.Group>
              </Form>
        </Container>
      );
            }
  }
  render() {
    //const mapContext = useContext(MapContext);
    if (typeof this.props.statuses !== 'undefined') {
      var _statuses = [];
      this.state.statuses.sort();
      //this.props.statuses.length
      for (var i = 0; i < this.state.statuses.length; i++) {
        _statuses.push({
          label: this.state.statuses[i],
          value: this.state.statuses[i]
        });
      }

      this.state.years.sort();
      var _years = [];
      for (i = 0; i < this.state.years.length; i++) {
        _years.push({
          label: this.state.years[i],
          value: this.state.years[i]
        });
      }

      this.state.managers.sort();
      var _man = [];
      for (i = 0; i < this.state.managers.length; i++) {
        _man.push({
          label: this.state.managers[i],
          value: this.state.managers[i]
        });
      }
    }
    if (typeof this.props.optionsStatus !== 'undefined') {
      console.log("filter component with drop downs")
      return (
        <Container>
          <Form inline>
            <Form.Group controlId="form.Filter">
              <Form.Label>Filter</Form.Label>
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
            </Form.Group>
          </Form>
        </Container>
             
          
        // <Container >
        //   <Form inline>
        //     <Form.Group controlId="form.Filter">
        //       <Form.Label>Filter</Form.Label>
        //       <Form.Control placeholder="Filter by Status" as="select" onChange={this._onSelect}>
        //         {this.props.optionsStatus.map((e, key) => {
        //           return <option key={key} value={e}>{e}</option>;
        //         })}
        //       </Form.Control>
        //       <Form.Control as="select" onChange={this._onSelect}>>
        //         {this.props.optionsYears.map((e, key) => {
        //         return <option key={key} value={e}>{e}</option>;
        //       })}
        //       </Form.Control>
        //       <Form.Control as="select" onChange={this._onSelect}>>
        //         {this.props.optionsManagers.map((e, key) => {
        //         return <option key={key} value={e}>{e}</option>;
        //       })}
        //       </Form.Control>
        //     </Form.Group>
        //   </Form>
        // </Container>
      );
    }
    else {
      console.log("filter component NO drop down VALUES")
      return (
        <Container>
          <Form>
            <Form.Group controlId="form.Filter">
              <Form.Label>Filter</Form.Label>
              <Form.Control placeholder="Filter by Status" as="select" onChange={this._onSelect}>
              <option key={"All Statuses"} value={"%"}>All Statuses</option>
              </Form.Control>
              <Form.Control as="select" onChange={this._onSelect}>>
              <option key={"All Years"} value={"%"}>All Years</option>
              </Form.Control>
              <Form.Control as="select" onChange={this._onSelect}>>
              <option key={"All Managers"} value={"%"}>All Managers</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Container>
      );
    }

  }
}

const mapStateToProps = state => ({
  
  optionsYears:state.map.years,
  optionsStatus: state.map.statuses,
  optionsManagers: state.map.managers,
  selectedYear: state.selectedYear,
  selectedStatus: state.selectedStatus,
  selectedManager: state.selectedManager,
  filter: state.filter
});
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators({
      ...filterActions
    }, dispatch);
  } 
/*   const mapDispatchToProps =  {
      mapActions
    
  }; 
  
export default connect(null, mapDispatchToProps) (Map); */
//export default FilterComponent; 
/* const mapStateToProps = state => ({
  config: state.config,
  map: state.map
});

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions
  }, dispatch);
}*/
//export default FilterComponent;
// export default connect(
//   mapStateToProps, mapDispatchToProps
// ) (FilterComponent); 
//export default FilterComponent;
export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (FilterComponent);