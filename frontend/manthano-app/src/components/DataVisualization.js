import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Helmet} from "react-helmet";

class DataVisualization extends Component {
  render() {
    return (
      <div>
        <Helmet>
            <script>{this.props.plot}</script>
        </Helmet>
        <div id={this.props.plotid}></div>
      </div>
    );
  }
}

DataVisualization.propTypes = {
  plot: PropTypes.string.isRequired,
  plotid: PropTypes.string.isRequired
}

export default DataVisualization;
