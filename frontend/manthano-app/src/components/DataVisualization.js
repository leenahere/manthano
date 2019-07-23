import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Helmet} from "react-helmet";

class DataVisualization extends Component {
  render() {
    return (
      <div>
        <img src={this.props.plot}/>
      </div>
    );
  }
}

DataVisualization.propTypes = {
  plot: PropTypes.string.isRequired,
  plotid: PropTypes.string.isRequired
}

export default DataVisualization;
