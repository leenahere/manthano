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
    problem: "",
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.forceUpdate != nextProps.forceUpdate) {
      this.setState({
        resultData: "",
      })
    }
  }


  handleClickRun = () => {
    var code = this.props.code;
    var problemClass = code.split("\n")[0];
    console.log(problemClass);
    if (problemClass == 'classification') {
      var locationUrl = 'http://'  + window.location.hostname + ':80/api/runcode/classification/'+ encodeURIComponent(code);
      this.setState({ loading: true, problem: "classification"}, () => {
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
          this.setState(({
            loading: false,
          }))
          alert("Your model could not be trained. Please make sure that the model type fits the given data. Also go back to the data analysis and check if you configured the features and labels correctly.");
          console.log(error);
        });
      });
    } else if (problemClass == 'regression') {
      var locationUrl = 'http://'  + window.location.hostname + ':80/api/runcode/regression/'+ encodeURIComponent(code);
      this.setState({ loading: true, problem: "regression"}, () => {
        axios.get(locationUrl)
        .then(res => {
          console.log(res.data);
          this.setState({
            loading: false,
            resultData: res.data,
          });
        })
        .catch(error => {
          this.setState(({
            loading: false,
          }))
          alert("Your model could not be trained. Please make sure that the model type fits the given data. Also go back to the data analysis and check if you configured the features and labels correctly.");
          console.log(error);
        });
      });
    }

  }

  render() {
    console.log("it renders");
    console.log(this.props.code);
    console.log(this.state.resultData);

    let result;
    if (this.state.loading == false) {
      if (this.state.problem == "classification") {
        result = <img style={{ height: '100%', width: '100%'}} src={this.state.resultData}/>;
      } else if (this.state.problem == "regression") {
        result = <div><p>{ this.state.resultData[0] }</p><p>{ this.state.resultData[1] }</p></div>
      } else {
        result = <span></span>;
      }
    } else {
      result = <Loader type="Oval" color="#a8a8a8" height={80} width={80} />;
    }

    return (
      <div>
        <Button variant="light" onClick={this.handleClickRun}>Run Model</Button>
        { result }
      </div>
    );
  }

}

ModelResults.propTypes = {
  code: PropTypes.string.isRequired,
  forceUpdate: PropTypes.bool.isRequired,
}

export default ModelResults;
