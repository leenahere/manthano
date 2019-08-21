import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import * as blocks from './MLClassificationBlocks';
import axios from 'axios';
import Loader from 'react-loader-spinner';

// updates when state and props change
class ModelResults extends Component {
  state = {
    loading: false,
    resultData: "",
  }


  handleClickRun = () => {
    var code = this.props.code;
    var locationUrl = 'http://'  + window.location.hostname + ':80/api/runcode/'+ encodeURIComponent(code);
    this.setState({ loading: true}, () => {
      axios.get(locationUrl, { responseType: 'arraybuffer' })
      .then(res => {
        console.log(res.data);
        const base64 = btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
        console.log(base64);
        this.setState({
          loading: false,
          resultData: "data:;base64," + base64,
        });
      })
      .catch(error => {
        console.log(error);
      });
    });
  }

  render() {
    console.log("it renders");
    console.log(this.props.code);
    return (
      <div>
        <Button variant="light" onClick={this.handleClickRun}>Run Model</Button>
        {this.state.loading ? <Loader type="Oval" color="#a8a8a8" height={80} width={80} /> : <img style={{ height: '100%', width: '100%'}} src={this.state.resultData}/>}
      </div>
    );
  }

}

ModelResults.propTypes = {
  code: PropTypes.string.isRequired,
}

export default ModelResults;
