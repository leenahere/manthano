import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import * as blocks from './MLClassificationBlocks';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

// updates when state and props change
class ModelResults extends Component {
  state = {
    loading: false,
    resultData: "",
    resultDecBoundary: "",
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
        axios.get(locationUrl)
        .then(res => {
          console.log(res.data);
          console.log(Date.now());
          axios.get('http://'  + window.location.hostname + ':80/api/runcode/image/' + res.data[0] + '/' + Date.now(), { responseType: 'arraybuffer' })
          .then(res => {
            console.log(res);
            const base64Class = btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );
            this.setState({
              resultData: "data:;base64," + base64Class,
            });
          })
          .catch(error => {
            this.setState({
              loading: false,
            })
            alert("Couldn't plot classification matrix");
            console.log(error);
          });

          axios.get('http://'  + window.location.hostname + ':80/api/runcode/image/' + res.data[1] + '/' + Date.now(), { responseType: 'arraybuffer' })
          .then(res => {
            console.log(res);
            const base64Dec = btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );
            this.setState({
              loading: false,
              resultDecBoundary: "data:;base64," + base64Dec,
            });
          })
          .catch(error => {
            this.setState(({
              loading: false,
            }))
            alert("Couldn't plot decision boundaries");
            console.log(error);
          });
        })
        .catch(error => {
          this.setState({
            loading: false,
          })
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
    const handleOnDragStart = e => e.preventDefault();

    let result;
    if (this.state.loading == false) {
      if (this.state.problem == "classification") {
        result = <AliceCarousel mouseDragEnabled buttonsDisabled={true}>
                    <img onDragStart={handleOnDragStart} src={this.state.resultData}/>
                    <img onDragStart={handleOnDragStart} src={this.state.resultDecBoundary}/>
                  </AliceCarousel>
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
