import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';
import DataDragNDrop from './DataDragNDrop';
import { withTranslation, Translation  } from 'react-i18next';

class DataVisSelector extends Component {
  state = {
    showPlot: false,
    problem: "",
    features: [],
    labels: []
  }

  onPlotClick = () => {
    this.props.sendVisSelectors(this.state.features, this.state.labels, this.state.problem);
    this.props.showPlot(true);
  }

  myCallback = (featureList, labelList) => {
    this.setState({
      features: featureList,
      labels: labelList
    });
  }

  handleChange = (event) => {
  this.setState({
    problem: event.target.value
  });
}

  render() {
    let { t } = this.props;
    console.log(this.props);
    return (
      <div>
        <p>{t("datavisualization.problemclass")}</p>

        <ul>
          <li>
            <label>
              <input
                type="radio"
                value="classification"
                checked={this.state.problem === "classification"}
                onChange={this.handleChange}
                />
              {t("datavisualization.radio1")}
            </label>
          </li>

          <li>
            <label>
              <input
                type="radio"
                value="regression"
                checked={this.state.problem === "regression"}
                onChange={this.handleChange}
                />
              {t("datavisualization.radio2")}
            </label>
          </li>
        </ul>

        <DataDragNDrop list={this.props.list} callbackFromParent={this.myCallback} />

        <Button variant="light" onClick={this.onPlotClick}>{t("datavisualization.button")}</Button>

      </div>
    );
  }
}

DataVisSelector.propTypes = {
  csv: PropTypes.string.isRequired,
  list: PropTypes.object.isRequired,
  showPlot: PropTypes.func.isRequired,
  sendVisSelectors: PropTypes.func.isRequired,
}

export default withTranslation(['translations'])(DataVisSelector);
