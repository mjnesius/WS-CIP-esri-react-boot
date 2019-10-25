import React, { Component } from 'react';
import SearchComponent from './SearchComponent';

//redux
import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';

import { actions as filterActions } from '../redux/reducers/filters';
import { parseContractorData, parseDomainValues } from '../redux/selectors';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';

import Panel, {
    PanelTitle,
    PanelText
  } from 'calcite-react/Panel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import Form, {
    FormControl,
    FormControlLabel
} from 'calcite-react/Form';
import { MenuItem } from 'calcite-react/Menu';
import TextField from 'calcite-react/TextField';
//import Select from 'calcite-react/Select';
//import styled from 'styled-components';
// const Container = styled.div`
//   display: inline-flex;
//   width: 100%;
//   height: 100%;
//   text-align: center;
//   flex-grow: 2;
//   justify-content: center;
//   overflow-y: auto;
// `;
 

class ContractorAttributes extends Component{
     constructor(props){
         super(props);
         this.state = {
             selectedContractor: this.props.selectedContractor,
         }
     }
     _handleChangeEvent(val) {
        console.log("_handleChangeEvent val is: ", val.target);
        let stateCopy ={...this.props.selectedContractor};
        stateCopy[val.target.id] = val.target.value;
        // val['Contractor']
        // this.setState({          
        //     ..,
        //     contractor: this.props.selectedContractor['Contractor'] ? this.props.selectedContractor['Contractor'] : ""
        // });
        this.props.setSelected(stateCopy, 'contractors')
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

    _returnDomainDropdowns(domainName){
        let items = [];
        this.props.domains.forEach(function(_domain){
            if (!(_domain[domainName] === undefined || _domain[domainName] === null)){
                Object.keys(_domain[domainName]).forEach(function(key){
                    var _key = Object.keys(_domain[domainName][key])[0];
                    var _val = _domain[domainName][key][_key];
                    items.push( <MenuItem key ={_key} value={_key} >{ _val}</MenuItem>);
                })
                
            } else {
            }
        });
        return items;
    }

    componentDidUpdate(prevProps){
        console.log("component didupate(): \n\tprevProps.selectedContractor: ", prevProps.selectedContractor, "\n\tthis.props.selectedContractor: ", this.props.selectedContractor)
        if(prevProps.selectedContractor !== this.props.selectedContractor){
            console.log("setting component's state")
            this.setState({          
                selectedContractor: this.props.selectedContractor
            });
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <Row > 
                    <Panel style={{flex: 1}}>
                        <Col lg="12">
                            <SearchComponent type='contractor'/>
                        </Col>
                    </Panel>
                </Row>
                <Row >
                    <Form horizontal style={{ flex: 1 }}>
                        <Row style={{ flex: 1 }}>
                            <Col sm="4">
                                <FormControl required>
                                    <FormControlLabel style={{ minWidth: '160px' }}>Contractor</FormControlLabel>
                                    <input type="textarea" id="Contractor" style={{ maxWidth: '100%', resize: "both" }}
                                        onChange={this._handleChangeEvent.bind(this)}
                                        value={this.props.selectedContractor['Contractor']}
                                         />
                                </FormControl>
                            </Col>
                            <Col sm="4">
                                <FormControl>
                                    <FormControlLabel style={{ minWidth: '120px' }}>Main Number</FormControlLabel>
                                    <TextField id="Main_Number" value={this.props.selectedContractor['Main_Number']} onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                    </TextField>
                                </FormControl>
                            </Col>
                            <Col sm="4">
                                <FormControl error required>
                                    <FormControlLabel style={{ minWidth: '140px' }}>Contact Email</FormControlLabel>
                                    <TextField label="Email:" id="Contact_Email" value={this.props.selectedContractor['Contact_Email']} onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                    </TextField>
                                </FormControl>
                            </Col>
                            <Col sm="4">
                                <FormControl required>
                                    <FormControlLabel style={{ minWidth: '120px' }}>Contact</FormControlLabel>
                                    <TextField id="Contact_LastName" value={this.props.selectedContractor['Contact_LastName']} onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                    </TextField>
                                </FormControl>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    contractors: parseContractorData(state),
    selectedContractor: state.attributes.selectedContractor,
    isVisible: state.map.attributesComponent,
    card: state.attributes.card,
    featureURLs: state.config.featureURLs,
    saveButton: state.attributes.saveButton,
    domains: parseDomainValues(state),
    optionsManagers: state.map.managers,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...filterActions, ...mapActions, ...attributeActions
    }, dispatch);
}  

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (ContractorAttributes);