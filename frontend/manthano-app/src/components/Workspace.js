import React, { Component } from 'react';
import axios from 'axios';
import BlocklyWorkspace from './BlocklyWorkspace';
import {Tab, Tabs} from 'react-bootstrap';
import Data from './Data';
import 'bootstrap/dist/css/bootstrap.css';

// updates when state and props change
class Workspace extends Component {
  state = {
    loading: true,
    pythonCode: '',
    csvdata: [],
    key: 'home',
  }

  componentDidMount() {
    axios.get('http://'  + window.location.hostname + ':80/api/csvdata/4')
    .then(res => this.setState({
        loading: false,
        csvdata: res.data
      }))
    .catch(error => {
      console.log(error);
    });
  }

  updateCode = (code) => {
    var locationUrl = 'http://'  + window.location.hostname + ':80/api/robotcode/1';
    var idrobot = "b14";
    var codestring = code;

    console.log(codestring);

    axios.put(locationUrl, {
      "robot": idrobot,
      "code": codestring
    })
    .then(res => console.log(res))

    this.setState({
      pythonCode: codestring,
    });
  };

  render() {
    let content;

    if (this.state.loading) {
      content = <div>Loading...</div>;
    } else {
      content =
      <Tabs
       id="controlled-tab-example"
       activeKey={this.state.key}
       onSelect={key => this.setState({ key })}
     >
       <Tab eventKey="home" title="Blockly">
         <BlocklyWorkspace updateCode={ this.updateCode } pythonCode={ this.state.pythonCode }/>
       </Tab>
       <Tab eventKey="data" title="Data">
         <Data csvdata={ this.state.csvdata }/>
       </Tab>
     </Tabs>
    }
    return (
      <div>

        { content }
      </div>
    );
  }

}

export default Workspace;
