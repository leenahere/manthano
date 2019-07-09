import React, { Component } from 'react';
import axios from 'axios';
import BlocklyWorkspace from './components/BlocklyWorkspace'

// updates when state and props change
class App extends Component {
  state = {
    pythonCode: '',
  }

  updateCode = (code) => {
    var locationUrl = 'http://'  + window.location.hostname + ':5000/api/robotcode/1';
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
    return (
      <div>
        <BlocklyWorkspace updateCode={ this.updateCode } pythonCode={ this.state.pythonCode }/>
        <pre>
          {JSON.stringify(this.state, null, 4)}
        </pre>
      </div>
    );
  }

}

export default App;
