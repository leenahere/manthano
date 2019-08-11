import React, { Component } from 'react';
import axios from 'axios';
import BlocklyWorkspace from './components/BlocklyWorkspace';
import Data from './components/Data';
import 'bootstrap/dist/css/bootstrap.css';
import Workspace from './components/Workspace';
import Loader from 'react-loader-spinner';
import Popup from 'reactjs-popup';
import Button from 'react-bootstrap/Button';

const connection = {
  NOTHIN: 1,
  UNUSCCESSFUL: 2,
  SUCCESSFUL: 3
}

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
    ip: "",
    status: true,
    // connected auf 0, not yet connected, connected auf 1: could not connect try again, connected auf 2: connected
    connected: connection.NOTHIN,
    showPopup: false,
    correctFormat: false,
  }

  handleChange = (event) => {
    this.setState({ ip: event.target.value })
    if(event.target.value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      this.setState({
        correctFormat: true
      });
    } else {
      this.setState({
        correctFormat: false
      });
    }
  }

  handleSubmit = () => {
    console.log(this.state.ip);
    axios.get('http://'  + window.location.hostname + ':80/api/connect/' + this.state.ip + '/robot/maker')
    .then(res => this.setState({
      connected: (res.data ? connection.SUCCESSFUL : connection.UNUSCCESSFUL)
    }))
    .catch(error => {
      console.log(error);
    });
    // hier axios call, wenn dieser erfolgreich, dann connected auf True
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
    let ev3Connect;
    switch(this.state.connected) {
      case connection.NOTHIN:
      ev3Connect = <span></span>
      break;
      case connection.UNUSCCESSFUL:
      ev3Connect = <span style={{color: 'red'}}>Connection refused. Please re-check your robot's IP and try again.</span>
      break;
      case connection.SUCCESSFUL:
      ev3Connect = <span style={{color: 'green'}}>Connection successful. You are connected to the robot with the IP address {this.state.ip}</span>
      break;
      default:
      ev3Connect = <span>Something's wrong</span>
      break;
    }
    const isLoaded = this.state.isLoaded;
    console.log(isLoaded);
    if (!isLoaded) {
      return(
        <div><Loader type="Oval" color="#somecolor" height={80} width={80} /></div>
      );
    } else {
      return(
      <div>
        <div>
          <h1>Manthano App Yo</h1>
          <Popup
            trigger={<Button variant="light">Connect to EV3</Button>}
            modal
            closeOnDocumentClick
            >
            {close => (
              <div>
                <form> //TODO add user and pw input to form
                  <label>
                    IP address:
                    <input type="text" value={this.state.ip} onChange={this.handleChange}/>
                  </label>
                  <Button onClick={() => {
                      close();
                      this.handleSubmit();
                    }} disabled={!this.state.correctFormat} variant="light">Connect</Button>
                  </form>
                  { this.state.correctFormat
                    ? <span style={{color: 'green'}}>Valid IP address</span>
                    : <span style={{color: 'red'}}>You need to enter a IP address</span>
                }
              </div>
            )}
          </Popup>
          { ev3Connect }
        </div>
        <div>
          <Workspace session={this.state.sessionId}/>
        </div>
      </div>
    );
  }
}
}

export default App;
