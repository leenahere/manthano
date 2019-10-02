import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';
import { withTranslation, Translation  } from 'react-i18next';

class Plot extends Component {
  onResetClick = () => {
    this.props.showPlot(false);
  }

  render() {
    let { t } = this.props;
    return (
      <div>
        <Button variant="light" onClick={this.onResetClick}>{t("plot.button")}</Button>
        <img src={this.props.plot}/>
      </div>
    );
  }
}

Plot.propTypes = {
  plot: PropTypes.string.isRequired,
  showPlot: PropTypes.func.isRequired,
}

export default withTranslation(['translations'])(Plot);
