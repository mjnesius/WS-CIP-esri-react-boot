// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// NOTE
// This is a "special" react component that does not strictly play by
// React's rules.
//
// Conceptually, this component creates a "portal" in React by
// closing its render method off from updates (by simply rendering a div and
// never accepting re-renders) then reconnecting itself to the React lifecycle
// by listening for any new props (using componentWillReceiveProps)

// React
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as mapActions } from '../../../redux/reducers/map';
import { actions as filterActions } from '../../../redux/reducers/filters';
import { actions as attributeActions } from '../../../redux/reducers/attributes';
import {StoreContext} from '../../StoreContext';
// ESRI
import { loadModules } from 'esri-loader';
import { createView } from '../../../utils/esriHelper';

// Styled Components
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
//import { stat } from 'fs';
//import yargs from 'yargs';
//import PencilSquare16 from '@esri/calcite-ui-icons';
//import { annotateTool24 } from "@esri/calcite-ui-icons";
//import PencilSquareIcon from 'calcite-ui-icons-react/PencilSquareIcon';
//import FilterComponent from '../../Filters';
import TableIcon from 'calcite-ui-icons-react/TableIcon';

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

// const SVG =({
//   style = {},
//   fill = '#fff',
//   width = '100%',
//   className = 'svg-icon-light-blue',
//   height = '100%',
//   viewBox = '0 0 16 16',
// }) =><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="svg-icon-light-blue"><path d="M2 2v26h30V2H2zm14 7.999h6V14h-6V9.999zM16 16h6v4h-6v-4zm-2 10H4v-4h10v4zm0-6H4v-4h10v4zm0-6H4V9.999h10V14zm2 12v-4h6v4h-6zm14 0h-6v-4h6v4zm0-6h-6v-4h6v4zm0-6h-6V9.999h6V14z"/></svg>


// Variables
const containerID = "map-view-container";
var openDetailsAction = {
  title: "Edit Details",
  id: "edit-details",
  className: "esri-icon-table"
};
var popupEditorAction = {
  title: "Edit Popup",
  id: "edit-popup",
  className: "esri-icon-edit"
};

var geometryEditorAction = {
  title: "Edit Geometry",
  id: "edit-geometry",
  className: "esri-icon-polyline"
};
var actionsButtons = [openDetailsAction, popupEditorAction, geometryEditorAction]




class Map extends Component {
   constructor (props) {
     super(props);
     //set this binding to the class; note: arrow functions do not have their own context
     this.setupEventHandlers = this.setupEventHandlers.bind(this);
     //this.toggleAttributes = this.props.toggleAttributes.bind(this);
     //this.editDetails = this.editDetails.bind(this);
     //this.editGeom = this.editGeom.bind(this);
     console.log(this.props);
     }

  componentDidMount() {
    this.startup(
      this.props.mapConfig,
      containerID,
      this.props.is3DScene
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Tell React to never update this component, that's up to us
    return true;
  }
  componentDidUpdate(){
    console.log(" this.props.defExp:   ", this.props.defExp);
    

    if (this.map.layers.length > 0) {
      var lyr = this.map.layers.getItemAt(0);
      console.log(lyr.definitionExpression, " vs ", this.props.defExp)
      if (!(lyr.definitionExpression === this.props.defExp)) {
        lyr.definitionExpression = this.props.defExp;
        var query = lyr.createQuery();
        query.returnGeometry = true;
        query.where =this.props.defExp ? this.props.defExp : "1=1";
        lyr.queryFeatures(query).then((response) => {
          var repObj = response.toJSON();
          console.log("getFeatures json: ", repObj)
          this.props.setFeatures(repObj.features);
          this.props.setFields(lyr.fields);
        })
      }
     }
  }

  editGeom = () => {
    console.log("editGeom()");
    //startUpdateWorkflowAtFeatureEdit(feature) of the esri-widgets-Editor-EditorViewModel
  }

  editDetails = () =>{
    console.log("editDetails"); 
    this.toggleAttributes();
  };
  
  

  // ESRI JSAPI
  startup = (mapConfig, node, isScene = false) => {
    createView(mapConfig, node, isScene).then(
      response => {
        this.init(response);
        this.setupWidgetsAndLayers();
        //console.log("this.setupEventHandlers(this.map)");
        //console.log("this.view: ", typeof(this.view));
        //.log("this.finishedLoading();");
        this.finishedLoading();
        this.setupEventHandlers(this.view, this.map);
      },
      error => {
        console.error("map err in createView/startup", error);
        window.setTimeout( () => {
          this.startup(mapConfig, node);
        }, 1000);
      })
  }

  finishedLoading = () => {
    // Update app state only after map and widgets are loaded
    this.props.onMapLoaded();
    
  }

  init = (response) => {
    this.view = response.view
    this.map = response.view.map;
  }

  setupWidgetsAndLayers = () => {
    loadModules(['esri/layers/FeatureLayer','esri/widgets/Editor', 'esri/widgets/Expand',
    'esri/widgets/BasemapGallery'
    ])
    .then( ([ FeatureLayer, Editor, Expand, BasemapGallery
    ], containerNode) => {
      var popTemplate = {
        title: "Water-Sewer CIP",
        content: "{Project_Name}",
        actions: actionsButtons
      }
      const featureLayer = new FeatureLayer({
        outFields: ["*"],
        portalItem: { // autocasts as new PortalItem()
          id: "10c79e631ce84ca19e5cdb7bb118262b"
        },
        title: "WaterSewerPM",
        id: "projects",
        popupTemplate: popTemplate
      });
      this.map.add(featureLayer);
      // featureLayer.when(function () {
      //   console.log("layer relationships", featureLayer.relationships.length);
      
      //   featureLayer.relationships.forEach(function (relationship) {
      //     console.log("relationship id:", relationship.id)
      //     console.log("relationship cardinality:", relationship.cardinality)
      //     console.log("relationship key field:", relationship.keyField)
      //     console.log("relationship name:", relationship.name)
      //     console.log("relationship relatedTableId:", relationship.relatedTableId)
      //   });
      // });

      var basemapGallery  = new BasemapGallery({
        view: this.view
      });

      var expandBasemap = new Expand({
        expandIconClass: "esri-icon-basemap",
        view: this.view,
        content: basemapGallery,
        expandTooltip: "Expand Basemap Gallery"
      });

      this.view.ui.add(expandBasemap, {position :"top-right"});

      const editor = new Editor({
        view: this.view,
        container: containerNode,

      });

      var expandEditor = new Expand({
        expandIconClass: "esri-icon-edit",
        view: this.view,
        content: editor,
        expandTooltip: "Expand Edit Widget"
      });
      
      this.view.ui.add(expandEditor, "top-right"); 
      const renderTooltip = props => (
        <div
          {...props}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: '2px 5px',
            color: 'black',
            borderRadius: 1,
            borderStyle: 'solid',
            borderWidth: 1,
            fontFamily: 'Times New Roman',
            fontSize:12,
            ...props.style,
          }}
        >
          Launch Attribute Panel
        </div>
      );

      const butt = <OverlayTrigger
        placement="bottom-start"
        delay={{ show: 250, hide: 200 }}
        overlay={renderTooltip}>
          <Button as="div" size="sm" variant="light"
            onClick={() => this.props.toggleAttributes()}>
            <TableIcon size={16} filled />
          </Button>
        </OverlayTrigger>;

      var btn = document.createElement("div");
      btn.setAttribute("id", "projectAttributes");
      this.view.ui.add(btn, "top-right");
      ReactDOM.render(butt, document.getElementById("projectAttributes"));

      featureLayer.when(function() {
        //featureLayer.definitionExpression = createDefinitionExpression("");
        zoomToLayer(featureLayer);
        getFeatures(featureLayer);
        this.featureLayer = featureLayer;
        
        
      });
      featureLayer.on("edits",  function(event) {

        const extractObjectId = function(result) {
          return result.objectId;
        };
      
        const adds = event.addedFeatures.map(extractObjectId);
        console.log("addedFeatures: ", adds.length, adds);
      
        const updates = event.updatedFeatures.map(extractObjectId);
        console.log("updatedFeatures: ", updates.length, updates);
      
        const deletes = event.deletedFeatures.map(extractObjectId);
        console.log("deletedFeatures: ", deletes.length, deletes);
        getFeatures(featureLayer);
      });

      // function createDefinitionExpression(subExpression) {
      //    const baseExpression =
      //      "( 1=1 )";
      //    var _stat = typeof store.statuses !== 'undefined' ? store.selectedStatus : "";
         
      //    var _yr =  store.selectedYear ? store.selectedYear : "";
      //    var _man = store.selectedManager ? store.selectedManager : "";
      //    subExpression = "Status Like '%" + _stat
      //        + "%' AND Project_Manager Like '%" +_man
      //        + "%' AND Proposed_Year Like '%" + _yr +"%'";
        
      //   //console.log("def expression ", baseExpression + " AND (" + subExpression +")")
      //   return subExpression ? baseExpression + " AND (" + subExpression +
      //     ")" : baseExpression;
      // }

      const zoomToLayer = (layer) => {
        return layer.queryExtent()
          .then((response) => {
            this.view.goTo(response.extent);
          });
      }
    
      const getFeatures = (layer) => {
        var query = layer.createQuery();
        query.returnGeometry = true;
        query.where = this.props.map.defExp ? this.props.map.defExp : "1=1"
        return layer.queryFeatures(query)
          .then((response) => {
            var repObj = response.toJSON();
            console.log("getFeatures json: ", repObj)
            this.props.setFeatures(repObj.features);
            this.props.setFields(layer.fields);
            this.props.getEmployees(this.props.config.employeesURL);
            this.props.getContractors(this.props.config.contractorsURL);
          }).then((res) => {
        });
      }
      
      //
      // JSAPI Map Widgets and Layers get loaded here!
      //

    });
  }

  setupEventHandlers = (view, map) => {
    console.log("setupEventHandlers()\tprops\t", this.props);
    //console.log("setupEventHandlers()\view\t", view);
    //this popup.on function is messing up the "this" context
    

    view.popup.on("trigger-action",  (event) => {
      // If the zoom-out action is clicked, fire the zoomOut() function
      console.log(event);
      console.log(event.action);
      if (event.action.id === "edit-geometry") {
        this.editGeom();
      }
      if (event.action.id === "edit-popup") {
        console.log("this.view: ", view);
        view.ui.editor.viewModel.startUpdateWorkflowAtFeatureSelection()
        //editPopup(view.popup);
      }

      if (event.action.id === "edit-details") {
        //console.log("edit-details()");
        console.log("edit-details() type: ");
        this.props.toggleAttributes();
        //this.editDetails();
        var selected = {};
        selected['feature'] = view.popup.selectedFeature['attributes'];
        this.props.selectFeature(selected['feature']);
        this.props.setPanel("project_details");

        // var prom = new Promise (() => {
        //   var selected = {};
        //   console.log("view.popup.selectedFeature: ", JSON.stringify(view.popup.selectedFeature));
        //   selected['feature'] = view.popup.selectedFeature['attributes'];
        //   console.log("selected['feature']: ", JSON.stringify(selected['feature']));
        //   this.props.selectFeature(selected['feature']);
        // });
        // prom.then(res => {
        //   console.log("prom.then")
        //   this.props.setPanel("project_details")
        // }).catch(console.error('prom error'));
        // prom.then(() => {
        //   this.props.setPanel("project_details");
        // })
        // need to TOGGLE_ATTRIBUTES action, SELECT_FEATURE acction with feature payloadthen SET_PANEL action with "project_details"
        //editPopup(view.popup);
      }
    });

    //
    // JSAPI Map Event Handlers go here!
    //
  }
  
  render() {
    return (
        <Container ref="mapDiv" id={containerID}/>
    );
  }
}

//this function defines which data from the redux store this connected component needs
const mapStateToProps = state => ({
  config: state.config,
  map: state.map,
  //featureLayer: state.map.featureLayer,
  defExp: state.filter.defExp,
  selectedYear: state.filter.selectedYear,
  selectedStatus: state.filter.selectedStatus,
  selectedManager: state.filter.selectedManager,
  fields: state.map.fields
});

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions, ...filterActions, ...attributeActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (Map);
//export default connect(mapStateToProps, mapDispatchToProps) (Map);