import React, { Component } from 'react';
import BlocklyWorkspace from './BlocklyWorkspace';
import {Tab, Tabs} from 'react-bootstrap';
import Data from './Data';
import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from 'prop-types';
import ModelResults from './ModelResults';

class Workspace extends Component {
  state = {
    pythonCode: '',
    key: 'blockly',
    forceBlocklyUpdate: false
  }

  // This callback is necessary to force an update of the blockly workspace, if the user added new data, so it can be added to the data list in the data block
  updateForceUpdate = () => {
    this.setState({
      forceBlocklyUpdate: !this.state.forceBlocklyUpdate,
    })
  }

  // TODO This is kind of the endpoint to run a model on the robot, however, not quite yet.
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

  // Handles update of the model code generated in the Blockly Workspace to hand it over to the ModelResult component
  updateCode= (code) => {
    this.setState({
      pythonCode: code,
    })
  }

  render() {
    // Returns the Blockly Workspace and ModelResult component, in the second Tab it returns the Data Analysis Component
    console.log(this.props)
    return (
      <div>
        <Tabs
         id="controlled-tab-example"
         activeKey={this.state.key}
         onSelect={key => this.setState({ key })}
       >
         <Tab eventKey="blockly" title="Blockly">
           <div style={{display: 'flex', height: 'calc(100vh - 210px)', width: '100vw'}}>
             <div style={{ display: 'flex', flexDirection: 'column', width: '55%' }}>
               <BlocklyWorkspace updateCode={ this.updateCode } pythonCode={ this.state.pythonCode } forceUpdate= { this.state.forceBlocklyUpdate } session={this.props.session}/>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
               <ModelResults forceUpdate={ this.state.forceBlocklyUpdate } code={ this.state.pythonCode } />
             </div>
           </div>
         </Tab>
         <Tab eventKey="data" title="Data">
           <Data forceUpdate={this.updateForceUpdate} session={this.props.session} csvList={this.props.csvList} csvContents={this.props.csvContents} delimiters={this.props.delimiters} connection={this.props.connection}/>
         </Tab>
       </Tabs>
      </div>
    );
  }

}

Workspace.propTypes = {
  session: PropTypes.string.isRequired,
  csvList: PropTypes.array.isRequired,
  csvContents: PropTypes.array.isRequired,
  delimiters: PropTypes.array.isRequired,
  connection: PropTypes.string.isRequired
}

export default Workspace;
