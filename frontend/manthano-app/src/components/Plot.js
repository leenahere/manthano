import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';

class Plot extends Component {
  onResetClick = () => {
    this.props.showPlot(false);
  }

  render() {
    return (
      <div>
        <Button variant="light" onClick={this.onResetClick}>Reset</Button>
        <img src={this.props.plot}/>
      </div>
    );
  }
}

Plot.propTypes = {
  plot: PropTypes.string.isRequired,
  showPlot: PropTypes.func.isRequired,
}

export default Plot;
