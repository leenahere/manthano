import React, { Component } from 'react';
import Blockly from 'node-blockly/browser';
import BlocklyDrawer, { Block, Category } from 'react-blockly-drawer';
import Button from 'react-bootstrap/Button';
import './App.css';

const kNearNeigh = {
  name: 'Blabla',
  category: 'Machine Learning',
  block: {
    init: function () {
      this.jsonInit({
        message0: Blockly.Msg['TEXT_PRINT_TITLE'],
        args0: [
          {
            type: "input_value",
            name: "TEXT"
          }
        ],
        style: "text_blocks",
        tooltip: Blockly.Msg['TEXT_PRINT_TOOLTIP']
      });
    },
  },
  generator: (block) => {
    // Print statement.
    var value_text = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_ATOMIC);
    //const code = 'print(' + msg + ')\n';
    var code = 'print' + value_text
    //return [code, Blockly.Python.ORDER_MEMBER];
    return code;
  },
};

const helloWorld = {
  name: 'HelloWorld',
  category: 'Demo',
  block: {
    init: function () {
      this.jsonInit({
        message0: 'Hello %1',
        args0: [
          {
            type: 'field_input',
            name: 'NAME',
            check: 'String',
          },
        ],
        output: 'String',
        colour: 160,
        tooltip: 'Says Hello',
      });
    },
  },
  generator: (block) => {
    const message = block.getFieldValue('NAME');
    const code = "\"Hello " + message + "\"";
    return [code, Blockly.Python.ORDER_MEMBER];
  },
};

// workaround for extra component for blockly toolbox and workspace
// never renders again due to shouldComponentUpdate = false
// needs to be done because of weird behavior, see this issue https://github.com/xvicmanx/react-blockly-drawer/issues/14
class BlocklyWrapper extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <BlocklyDrawer
          language={Blockly.Python}
          tools={[helloWorld, kNearNeigh]}
          onChange={this.props.handleChange}
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
        <Button onClick={this.props.handleClick}>Click me!</Button>
      </div>
    );
  }
}

// updates when state and props change
class App extends Component {
  state = {
    pythonCode: '',
  }

  handleClick = () => {
    console.log(this.state);
  }

  handleChange = (code, workspace) => {
    this.setState({
      pythonCode: code,
    });
  }

  render() {
    return (
      <div>
        <BlocklyWrapper handleChange={this.handleChange} handleClick={this.handleClick}  />

        <pre>
          {JSON.stringify(this.state, null, 4)}
        </pre>
      </div>
    );
  }

}

export default App;
