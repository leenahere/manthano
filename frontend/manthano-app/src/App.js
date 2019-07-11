import React, { Component } from 'react';
import axios from 'axios';
import BlocklyWorkspace from './components/BlocklyWorkspace'
import Data from './components/Data';
import 'bootstrap/dist/css/bootstrap.css';

// updates when state and props change
class App extends Component {
  state = {
    loading: true,
    pythonCode: '',
    csvdata: [],
  }

  componentDidMount() {
    axios.get('http://'  + window.location.hostname + ':5000/api/csvdata/4')
    .then(res => this.setState({
        loading: false,
        csvdata: res.data
      }))
    .catch(error => {
      console.log(error);
    });
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
    let content;

    if (this.state.loading) {
      content = <div>Loading...</div>;
    } else {
      content =
        <div>
          <BlocklyWorkspace updateCode={ this.updateCode } pythonCode={ this.state.pythonCode }/>
          <Data csvdata={ this.state.csvdata }/>
        </div>
    }
    return (
      <div>
        { content }
      </div>
    );
  }

}

export default App;
