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

// React
import React, { Component } from 'react';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as mapActions } from '../redux/reducers/map';
import { actions as authActions } from '../redux/reducers/auth';

import {StoreContext} from './StoreContext';

// Components
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import TopNav from 'calcite-react/TopNav';
import TopNavBrand from 'calcite-react/TopNav/TopNavBrand';
import TopNavTitle from 'calcite-react/TopNav/TopNavTitle';
import TopNavList from 'calcite-react/TopNav/TopNavList';
import TopNavLink from 'calcite-react/TopNav/TopNavLink';
//import SceneViewExample from './esri/map/SceneViewExample';
import Map from './esri/map/Map';
import LoadScreen from './LoadScreen';
import UserAccount from './UserAccount';
import logo from '../styles/images/Logo.svg';
import FilterComponent from './Filters';

// Styled Components
import styled from 'styled-components';
import {Container as ContainerBS} from 'react-bootstrap/Container'
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  height: 100%;
  text-align: center;
`;

const MapWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  z-index: 0;
  overflow: hidden;
`;

const Logo = styled(TopNavBrand)`
  justify-content: center;
  & img {
    width="30"
    height="50"
        className="align-top"
  },
  background-color: $light-blue;
`;
//background-color: ${props => props.theme.palette.offWhite};
const Nav = styled(TopNav)`
  
background-color: $light-blue;

  z-index: 5
`;



// Class
class Main extends Component {
  signIn = () => {
    this.props.checkAuth('https://www.arcgis.com');
  }

  signOut = () => {
    this.props.logout();
  }

  render() {
    return (
      <Container>
        <LoadScreen isLoading={this.props.mapLoaded} />
        <Row className="bg-light">
          <Col lg={3}>
          <Navbar bg="light" variant="dark" className="bg-light">
          <Logo href="#" src={logo} />
          <TopNavTitle href="#">Water Sewer CIP</TopNavTitle>
          </Navbar>
          </Col>

          <Col className="text-align-between" >
          <FilterComponent/>
          </Col>
          <Col lg={2}>
            
          
          <UserAccount
            user={this.props.auth.user}
            portal={this.props.auth.user ? this.props.auth.user.portal : null}
            loggedIn={this.props.auth.loggedIn}
            signIn={this.signIn}
            signOut={this.signOut}
          />
          
        
          </Col>
          
        </Row>
        
        <MapWrapper>
          <Map onMapLoaded={this.props.mapLoaded} onSetFeatures={this.props.setFeatures} onSetFilters={this.props.setFilter}
            mapConfig={this.props.config.mapConfig}
            is3DScene={false}
          />
        </MapWrapper>
      </Container>
    )
  }
}
//
const mapStateToProps = state => ({
  map: state.map,
  auth: state.auth,
  config: state.config,
})

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions,
    ...authActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext})(Main)
