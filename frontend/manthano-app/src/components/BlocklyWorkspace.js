import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'node-blockly/browser';
import BlocklyDrawer, { Block, Category } from 'react-blockly-drawer';
import Button from 'react-bootstrap/Button';
import * as blocks from './MLClassificationBlocks';

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
  }

  handleChange = (code, workspace) => {
    this.setState({
      pythonCode: code,
    });
  }

  handleClick = () => {
    var code = this.state.pythonCode;
    this.props.updateCode(code);
  }

  render() {
    Blockly.HSV_SATURATION = 0.9;
    Blockly.HSV_VALUE = 0.9;
    return (
        <div>
          <BlocklyDrawer
            language={Blockly.Python}
            tools={[blocks.kNearNeigh, blocks.logRegression, blocks.naiveBayes, blocks.svm, blocks.linRegression, blocks.polyRegression, blocks.decisionTree, blocks.mlp, blocks.dataBlock, blocks.list]}
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
          <Button variant="light" onClick={this.handleClick}>Click me!</Button>
        </div>
    );
  }

}

BlocklyWorkspace.propTypes = {
  updateCode: PropTypes.func.isRequired,
  pythonCode: PropTypes.string.isRequired,
  forceUpdate: PropTypes.bool.isRequired
}

export default BlocklyWorkspace;
