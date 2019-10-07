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
//import ReactDOM from 'react-dom';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as mapActions } from '../../../redux/reducers/map';
import { actions as filterActions } from '../../../redux/reducers/filters';
import {StoreContext} from '../../StoreContext';
import {store} from '../../../index';
// ESRI
import { loadModules } from 'esri-loader';
import { createView } from '../../../utils/esriHelper';

// Styled Components
import styled from 'styled-components';
//import { stat } from 'fs';
//import yargs from 'yargs';
//import PencilSquare16 from '@esri/calcite-ui-icons';
//import { annotateTool24 } from "@esri/calcite-ui-icons";
//import PencilSquareIcon from 'calcite-ui-icons-react/PencilSquareIcon';
//import FilterComponent from '../../Filters';

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

// Variables
const containerID = "map-view-container";

class Map extends Component {
  // constructor (props) {
  //   super(props);
  //   this.state = {
  //     map:{
  //       features: [{}],
  //       loaded: Boolean,
  //       selectedYear: "",
  //       selectedStatus: "",
  //       selectedManager: "",
  //     },
  //     featureLayer: {},
  //     defExp:" "
  //   }
    
    //this.updateFilter = this.updateFilter.bind(this);
  //}
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
  componentDidUpdate(featureLayer){
    console.log(" this.props.defExp:   ", this.props.defExp);
    this.view.whenLayerView(this.map.layers.getItemAt(0)).then(function(featureLayerView) {
      featureLayerView.filter = {
        where: this.props.defExp
      };
    });
    // console.log(this.map.findLayerById("projects").then(function(lyr){
    //   console.log(lyr.title);
    //   console.log(lyr.id);
    // }));
    //console.log(this.map.findLayerById("projects").title);
    console.log("# of layers: ", this.map.layers.length);
    if(this.map.layers.length>0){
      console.log("title of layer 1: ", this.map.layers.getItemAt(0).title);
      
    this.map.layers.getItemAt(0).definitionExpression = this.props.defExp;
    }

    //  var propValue;
    //  for (var propName in this.map.layers) {
    //    propValue = this.map.layers[propName]

    //    console.log(propName, propValue);
    //  }
    // if(this.map.layers[0]){
    //   this.map.layers[0].definitionExpression(this.props.defExp);
    // }
    // if(this.props.map.layers){
    //   console.error("this.props.map.layers ");
    // }else{
    //   console.log("    skipped   ");
    // }
    
  }

  render() {
    return (
        <Container ref="mapDiv" id={containerID}/>
    );
  }

  // ESRI JSAPI
  startup = (mapConfig, node, isScene = false) => {
    createView(mapConfig, node, isScene).then(
      response => {
        this.init(response);
        this.setupEventHandlers(this.map);
        this.setupWidgetsAndLayers();
        this.finishedLoading();
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
    loadModules(['esri/layers/FeatureLayer','esri/widgets/Editor', 'esri/views/ui/UI' , 'esri/widgets/Expand',
    'esri/widgets/BasemapGallery','dojo/dom-construct'
    ])
    .then( ([ FeatureLayer, Editor, UI, Expand, BasemapGallery,domConstruct
    ], containerNode) => {
      const featureLayer = new FeatureLayer({
        outFields: ["*"],
        portalItem: { // autocasts as new PortalItem()
          id: "10c79e631ce84ca19e5cdb7bb118262b"
        },
        title: "WaterSewerPM",
        id: "projects"
      });
      this.map.add(featureLayer);

      var basemapGallery  = new BasemapGallery({
        view: this.view
      });

      var expandBasemap = new Expand({
        expandIconClass: "esri-icon-basemap",
        view: this.view,
        content: basemapGallery
      });

      this.view.ui.add(expandBasemap, {position :"top-right"});

      const editor = new Editor({
        view: this.view,
        container: containerNode,

      });

      var expandEditor = new Expand({
        expandIconClass: "esri-icon-edit",
        view: this.view,
        content: editor
      });
      
      this.view.ui.add(expandEditor, "top-right"); 

      //this.view.ui.add(FilterComponent, "center-right");
      //console.log("this.defExp ? ", this.state.defExp ? this.state.defExp: "...");

      featureLayer.when(function() {
        featureLayer.definitionExpression = createDefinitionExpression("");
        zoomToLayer(featureLayer);
        getFeatures(featureLayer);
        this.featureLayer = featureLayer;
        //this.setState({ featureLayer: featureLayer});
      });

      function createDefinitionExpression(subExpression) {
        //console.log("SUB expression ", subExpression ? subExpression: "... ");
        //console.log("selectedStatus ", typeof this.props.selectedStatus);
         const baseExpression =
           "( 1=1 )";
         var _stat = typeof store.statuses !== 'undefined' ? store.selectedStatus : "";
         //console.log("_stat ", _stat);
         var _yr =  store.selectedYear ? store.selectedYear : "";
         var _man = store.selectedManager ? store.selectedManager : "";
         subExpression = "Status Like '%" + _stat
             + "%' AND Project_Manager Like '%" +_man
             + "%' AND Proposed_Year Like '%" + _yr +"%'";
        
        //console.log("def expression ", baseExpression + " AND (" + subExpression +")")
        return subExpression ? baseExpression + " AND (" + subExpression +
          ")" : baseExpression;
      }

      const zoomToLayer = (layer) => {
        return layer.queryExtent()
          .then((response) => {
            this.view.goTo(response.extent);
          });
      }
      
      //this.view.ui.add(node, "top-trailing");
    //ReactDOM.render(<PencilSquareIcon filled onClick={() => console.log('clicked')} size={33} color="rgba(255, 255, 255, 0.8)"/>, node);
    
    
      const getFeatures = (layer) => {
        var query = layer.createQuery();
        query.returnGeometry = false;
        return layer.queryFeatures(query)
          .then((response) => {
            var repObj = response.toJSON();
            this.props.onSetFeatures(repObj.features);
            //this.props.onSetFeatures(response.features.toJSON());
           // var myJSON = repObj.features;
            //console.log("getFeatures " + myJSON);
          }).then((res) => {
            //const node = document.createElement("div");
            //  var node = domConstruct.create("div", {
            //   id: "divFilters", innerHTML: "<p>hi</p>", style:{width: "100%"}
            // });

            // //node.setAttribute("id", "divFilters");

            //  var expandFilters = new Expand({
            //   expandIconClass: "esri-icon-search",
            //   view: this.view,
            //   content: node
            // }); 
            // this.view.ui.add(expandFilters, "top-right");
            //  ReactDOM.render(<FilterComponent/>, node
            //  ); 
          //    ReactDOM.render(<FilterComponent years={this.props.map.years} 
          //     statuses={this.props.map.statuses} managers={this.props.map.managers}/>, node
          //  );  
            
          });
      }
      
      //
      // JSAPI Map Widgets and Layers get loaded here!
      //

    });
  }

  setupEventHandlers = (map) => {
    loadModules([

    ], (

    ) => {

      //
      // JSAPI Map Event Handlers go here!
      //

    });
  }
}

//this function defines which data from the redux store this connected component needs
const mapStateToProps = state => ({
  config: state.config,
  map: state.map,
  featureLayer: state.map.featureLayer,
  defExp: state.filter.defExp,
  selectedYear: state.filter.selectedYear,
  selectedStatus: state.filter.selectedStatus,
  selectedManager: state.filter.selectedManager,
});

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions, ...filterActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (Map);
//export default connect(mapStateToProps, mapDispatchToProps) (Map);