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

// ESRI
import { loadModules } from 'esri-loader';
import { createView } from '../../../utils/esriHelper';

// Styled Components
import styled from 'styled-components';
//import PencilSquare16 from '@esri/calcite-ui-icons';
//import { annotateTool24 } from "@esri/calcite-ui-icons";
import PencilSquareIcon from 'calcite-ui-icons-react/PencilSquareIcon';

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

// Variables
const containerID = "map-view-container";

class Map extends Component {

  componentDidMount() {
    this.startup(
      this.props.mapConfig,
      containerID,
      this.props.is3DScene
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Tell React to never update this component, that's up to us
    return false;
  }

  render() {
    return (
      
      <Container ref="mapDiv" id={containerID}>
        
      </Container>
      
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
        console.error("maperr", error);
        window.setTimeout( () => {
          this.startup(mapConfig, node);
        }, 1000);
      })
  }

  finishedLoading = () => {
    // Update app state only after map and widgets are loaded
    this.props.onMapLoaded();

    // const node = document.createElement("div");
    // this.view.ui.add(node, "top-left");
    // ReactDOM.render(<PencilSquareIcon filled onClick={() => console.log('clicked')} size={33} color="rgba(255, 255, 255, 0.8)"/>, node);
  }

  init = (response) => {
    this.view = response.view
    this.map = response.view.map;
  }

  setupWidgetsAndLayers = () => {
    loadModules(['esri/layers/FeatureLayer','esri/widgets/BasemapToggle','esri/widgets/Editor', 'esri/views/ui/UI' , 'esri/widgets/Expand',
    'esri/widgets/BasemapGallery'
    ])
    .then( ([ FeatureLayer, BasemapToggle, Editor, UI, Expand, BasemapGallery
    ], containerNode) => {
      const featureLayer = new FeatureLayer({
        outFields: ["*"],
        portalItem: { // autocasts as new PortalItem()
          id: "db4277871ee84772a964509f53071eda"
        },
        title: "CIP projects"
      });
      this.map.add(featureLayer);
      var basemapGallery  = new BasemapGallery({
        view: this.view
      });

      // var basemapToggle = new BasemapToggle({
      //   view: this.view,
      //   nextBasemap: "gray"
      // });
      // this.view.ui.add(basemapToggle, {position :"bottom-right"});

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

      featureLayer.when(function() {
        featureLayer.definitionExpression = createDefinitionExpression(
          "");
        zoomToLayer(featureLayer);
      });

      function createDefinitionExpression(subExpression) {
        const baseExpression =
          "( 1=1 )";

        return subExpression ? baseExpression + " AND (" + subExpression +
          ")" : baseExpression;
      }

      const zoomToLayer = (layer) => {
        return layer.queryExtent()
          .then((response) => {
            this.view.goTo(response.extent);
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

const mapStateToProps = state => ({
  config: state.config,
  map: state.map
});

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (Map);
