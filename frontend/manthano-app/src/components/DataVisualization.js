import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Plot from './Plot.js';
import DataVisSelector from './DataVisSelector.js';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { withTranslation, Translation  } from 'react-i18next';

class DataVisualization extends Component {
  state = {
    loading: false,
    showPlot: false,
    problem: "",
    features: [],
    labels: [],
    plot: "",
    error: false,
  }

  componentWillReceiveProps(nextProps) {
    // make sure that plot is dismissed when user selects another dataset from table
    if (this.props.csv != nextProps.csv) {
      this.setState({
        showPlot: false
      })
    }
  }

  plotOrSelector = (plot) => {
    this.setState({
      showPlot: plot
    })
  }

  getPlot = (features, labels, problem) => {
    console.log(features, labels, problem);
    this.setState({ loading: true, error: ""}, () => {
      axios.get('http://'  + window.location.hostname + ':80/api/plot/' + encodeURIComponent(this.props.csv) + '/' + this.props.delimiter + '/' + this.props.session + '/' + features + '/' + labels + '/' + problem, { responseType: 'arraybuffer' })
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
          plot: "data:;base64," + base64,
          loading: false
        })})
      .catch(error => {
        this.setState({
          error: true,
          showPlot: false,
          loading: false,
        })
        console.log(error);
      });
    });
  }

  render() {
    console.log(this.props);
    let { t } = this.props;
    let content;
    if (this.state.showPlot == false) {
      content = <DataVisSelector csv={this.props.csv} list={this.props.list} showPlot={this.plotOrSelector} sendVisSelectors={this.getPlot}/>
    } else {
      if (this.state.loading == false) {
        content = <Plot plot={this.state.plot} showPlot={this.plotOrSelector} />
      } else {
        content = <Loader type="Oval" color="#a8a8a8" height={80} width={80} />
      }
    }
    return (
      <div>
        { this.state.error
            ? <span style={{color: 'red'}}>{t("datavisualization.error")}</span>
            : <span></span>
        }
        {content}
      </div>
    );
  }
}

DataVisualization.propTypes = {
  csv: PropTypes.string.isRequired,
  list: PropTypes.object.isRequired,
  delimiter: PropTypes.string.isRequired,
  session: PropTypes.string.isRequired,
}

export default withTranslation(['translations'])(DataVisualization);
