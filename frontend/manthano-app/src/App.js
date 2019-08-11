import React, { Component } from 'react';
import axios from 'axios';
import BlocklyWorkspace from './components/BlocklyWorkspace';
import Data from './components/Data';
import 'bootstrap/dist/css/bootstrap.css';
import Workspace from './components/Workspace';
import Loader from 'react-loader-spinner';

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// updates when state and props change
class App extends Component {
  state = {
    sessionId: "",
    isLoaded: false,
  }

  componentDidMount() {
    if(localStorage.getItem('sessionID') != null) {
      this.setState({
        sessionId: localStorage.getItem('sessionID'),
        isLoaded: true
      });
    } else {
      var guid = guidGenerator();
      console.log(guid);
      localStorage.setItem('sessionID', guid);
      this.setState({
        sessionId: guid,
        isLoaded: true
      });
    }
  }

  render() {
    const isLoaded = this.state.isLoaded;
    console.log(isLoaded);
    if (!isLoaded) {
      return(
        <div><Loader type="Oval" color="#somecolor" height={80} width={80} /></div>
      );
    } else {
      return(
        <div><h1>Manthano App Yo</h1> <Workspace session={this.state.sessionId}/></div>
      );
    }
  }

}

export default App;
