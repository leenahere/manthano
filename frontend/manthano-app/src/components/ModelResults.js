import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { withTranslation, Translation  } from 'react-i18next';

const apiURL = 'http://'  + window.location.hostname + ':8080/api/';

// updates when state and props change
class ModelResults extends Component {
  state = {
    loading: false,
    resultData: "",
    resultDecBoundary: "",
    resultConfMatrix: "",
    resultRegression: "",
    mse: 0,
    r2: 0,
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
      var locationUrl = apiURL + 'runcode/classification/'+ encodeURIComponent(code) + '/' + this.props.session;
      this.setState({ loading: true, problem: "classification"}, () => {
        axios.get(locationUrl)
        .then(res => {
          this.props.trainedModel(res.data[3]);
          console.log(res.data);
          console.log(Date.now());
          axios.get(apiURL + 'runcode/image/' + res.data[0] + this.props.session + '/' + Date.now(), { responseType: 'arraybuffer' })
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

          axios.get(apiURL + 'runcode/image/' + res.data[2] + this.props.session + '/' + Date.now(), { responseType: 'arraybuffer' })
          .then(res => {
            console.log(res);
            const base64Class = btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );
            this.setState({
              resultConfMatrix: "data:;base64," + base64Class,
            });
          })
          .catch(error => {
            this.setState({
              loading: false,
            })
            alert("Couldn't plot confusion matrix");
            console.log(error);
          });

          axios.get(apiURL + 'runcode/image/' + res.data[1] + this.props.session + '/' + Date.now(), { responseType: 'arraybuffer' })
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
      var locationUrl = apiURL + 'runcode/regression/'+ encodeURIComponent(code) + '/' + this.props.session;
      this.setState({ loading: true, problem: "regression"}, () => {
        axios.get(locationUrl)
        .then(res => {
          axios.get(apiURL + 'runcode/image/' + res.data[0] + this.props.session + '/' + Date.now(), { responseType: 'arraybuffer' })
          .then(res => {
            console.log(res);
            const base64Class = btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );
            this.setState({
              resultRegression: "data:;base64," + base64Class,
            });
          })
          .catch(error => {
            this.setState({
              loading: false,
            })
            alert("Couldn't plot regression plot");
            console.log(error);
          });
          console.log(res.data);
          this.setState({
            loading: false,
            mse: res.data[1],
            r2: res.data[2]
          });
          this.props.trainedModel(res.data[3]);
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
    let { t } = this.props;
    let result;
    if (this.state.loading == false) {
      if (this.state.problem == "classification") {
        result = <div class="showImgL">
                    <img onDragStart={handleOnDragStart} src={this.state.resultData}/>
                    <img onDragStart={handleOnDragStart} src={this.state.resultConfMatrix}/>
                    <img onDragStart={handleOnDragStart} src={this.state.resultDecBoundary}/>
                  </div>
      } else if (this.state.problem == "regression") {
        result = <div class="showImgL">
                    <img onDragStart={handleOnDragStart} src={this.state.resultRegression}/>
                    <div class="textL" >
                      <span><b>Mean Squared Error:</b>  {this.state.mse} </span><br />
                      <span><b>R2:</b> {this.state.r2} </span>
                    </div>
                  </div>
      } else {
        result = <span></span>;
      }
    } else {
      result = <Loader type="Oval" color="#a8a8a8" height={80} width={80} />;
    }

    return (
      <div>
        <Button variant="light" onClick={this.handleClickRun}>▶️ {t("modelresults.button")}</Button>
        { result }
      </div>
    );
  }

}

ModelResults.propTypes = {
  session: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  forceUpdate: PropTypes.bool.isRequired,
  trainedModel: PropTypes.func.isRequired,
}

export default withTranslation(['translations'])(ModelResults);
