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
      return false;
    }
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
    return (
        <div>
          <BlocklyDrawer
            language={Blockly.Python}
            tools={[blocks.helloWorld, blocks.kNearNeigh, blocks.dataBlock]}
            onChange={this.handleChange}
            appearance={
              {
                categories: {
                  Demo: {
                    colour: '270'
                  },
                },
              }
            }
          >
            <Category name="Variables" custom="VARIABLE" />
            <Category name="Basics">
              <Block type="controls_if" />
              <Block type="logic_compare" />
              <Block type="controls_repeat_ext" />
              <Block type="math_arithmetic" />
              <Block type="text" />
              <Block type="text_print" />
              <Block type="math_number" />
            </Category>
            <Category name="Values">
              <Block type="math_number" />
              <Block type="text" />
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
