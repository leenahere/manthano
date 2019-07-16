import React, { Component } from 'react';
import axios from 'axios';
import BlocklyWorkspace from './components/BlocklyWorkspace';
import Data from './components/Data';
import 'bootstrap/dist/css/bootstrap.css';
import Workspace from './components/Workspace';

// updates when state and props change
class App extends Component {

  render() {
    return(
      <diV>
        <h1>Manthano App Yo</h1>
        <Workspace />
      </diV>
    );
  }

}

export default App;
