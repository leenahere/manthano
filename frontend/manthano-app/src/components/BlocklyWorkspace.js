import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'node-blockly/browser';
import BlocklyDrawer, { Block, Category } from 'react-blockly-drawer';
import Button from 'react-bootstrap/Button';
import * as classblocks from './MLClassificationBlocks';
import * as helperblocks from './helperBlocks';
import * as regblocks from './MLRegressionBlocks';
import axios from 'axios';
import Loader from 'react-loader-spinner';

// updates when state and props change
class BlocklyWorkspace extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.forceUpdate === nextProps.forceUpdate) {
      console.log("Blockly Workspace doesnt update");
      return false;
    }
    console.log("Blockly Workspace updates");
    return true;
  }

  state = {
    pythonCode: this.props.pythonCode,
    loading: false,
    resultData: "",
  }

  handleChange = (code, workspace) => {
    this.setState({
      pythonCode: code,
    });
    this.props.updateCode(code);
  }

  handleClick = () => {
    var code = this.state.pythonCode;
    this.props.updateCode(code);
  }

  handleClickRun = () => {
    var code = this.state.pythonCode;
    var locationUrl = 'http://'  + window.location.hostname + ':80/api/runcode/'+ encodeURIComponent(code);
    this.setState({ loading: true}, () => {
      axios.get(locationUrl)
      .then(res => {
        this.setState({
          loading: false,
          resultData: res.data,
        });
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      });
    });
  }

  render() {
    console.log("it renders");
    Blockly.HSV_SATURATION = 0.9;
    Blockly.HSV_VALUE = 0.9;
    return (
      <div>
          <BlocklyDrawer
            style={{ height: 'calc(100vh - 210px)'}}
            language={Blockly.Python}
            tools={[classblocks.kNearNeigh, classblocks.logRegression, classblocks.naiveBayes, classblocks.svm, regblocks.linRegression, regblocks.polyRegression, classblocks.decisionTree, classblocks.mlp, helperblocks.dataBlock, helperblocks.list]}
            onChange={this.handleChange}
            appearance={
              {
                categories: {
                  Demo: {
                    colour: '270'
                  },
                  Classification: {
                    colour: '56'
                  },
                  Data: {
                    colour: '30'
                  },
                  NeuralNets: {
                    colour: '320'
                  },
                  List: {
                    colour: '190'
                  },
                  Regression: {
                    colour: '120'
                  }

                },
              }
            }
          >
            <Category name="Values" colour='%{BKY_MATH_HUE}' >
              <Block type="lists_create_with" />
              <Block type="math_number" />
            </Category>
          </BlocklyDrawer>
      </div>
    );
  }

}

BlocklyWorkspace.propTypes = {
  updateCode: PropTypes.func.isRequired,
  pythonCode: PropTypes.string.isRequired,
  forceUpdate: PropTypes.bool.isRequired,
  session: PropTypes.string.isRequired,
}

export default BlocklyWorkspace;
