import React, { Component } from 'react';
import axios from 'axios';
import BlocklyWorkspace from './BlocklyWorkspace';
import {Tab, Tabs, Button} from 'react-bootstrap';
import Data from './Data';
import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import ModelResults from './ModelResults';

// updates when state and props change
class Workspace extends Component {
  state = {
    pythonCode: '',
    key: 'home',
    forceBlocklyUpdate: false
  }

  updateForceUpdate = () => {
    console.log("Force Update is called");
    console.log(this.state.forceBlocklyUpdate);
    this.setState({
      forceBlocklyUpdate: !this.state.forceBlocklyUpdate,
    })
  }

  // updateCode = (code) => {
  //   var locationUrl = 'http://'  + window.location.hostname + ':80/api/robotcode/1';
  //   var idrobot = "b14";
  //   var codestring = code;
  //
  //   console.log(codestring);
  //
  //   axios.put(locationUrl, {
  //     "robot": idrobot,
  //     "code": codestring
  //   })
  //   .then(res => console.log(res))
  //
  //   this.setState({
  //     pythonCode: codestring,
  //   });
  // };

  updateCode= (code) => {
    this.setState({
      pythonCode: code,
    })
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Tabs
         id="controlled-tab-example"
         activeKey={this.state.key}
         onSelect={key => this.setState({ key })}
       >
         <Tab eventKey="home" title="Blockly">
           <div style={{display: 'flex'}}>
             <div style={{ display: 'flex', flexDirection: 'column', width: '65%' }}>
               <BlocklyWorkspace updateCode={ this.updateCode } pythonCode={ this.state.pythonCode } forceUpdate= { this.state.forceBlocklyUpdate } session={this.props.session}/>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
               <ModelResults code={ this.state.pythonCode } />
             </div>
           </div>
         </Tab>
         <Tab eventKey="data" title="Data">
           <Data forceUpdate={this.updateForceUpdate} session={this.props.session} ip={this.props.ip} user={this.props.user} pw={this.props.pw} connection={this.props.connection}/>
         </Tab>
       </Tabs>
      </div>
    );
  }

}

Workspace.propTypes = {
  session: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  pw: PropTypes.string.isRequired,
  connection: PropTypes.string.isRequired
}

export default Workspace;
