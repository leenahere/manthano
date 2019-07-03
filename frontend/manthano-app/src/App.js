import React, { Component } from 'react';
import Blockly from 'node-blockly/browser';
import BlocklyDrawer, { Block, Category } from 'react-blockly-drawer';
import Button from 'react-bootstrap/Button';
import './App.css';

const kNearNeigh = {
  name: 'Blabla',
  category: 'Machine Learning',
  block: {
    init: function() {
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
    var code = 'print'+ value_text
    //return [code, Blockly.Python.ORDER_MEMBER];
    return code;
  },
};

const helloWorld =  {
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

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.handleChange = this.handleChange.bind(this);
  //   this.handleClick = this.handleClick.bind(this);
  //   this.state = {
  //     pythonCode: ""
  //   };
  // }
  //
  // handleClick() {
  //   console.log(this.state.pythonCode);
  // }
  //
  // handleChange(code, workspace) {
  //   this.setState({
  //        pythonCode: code
  //   });
  // }


//onChange={this.handleChange} das würde ich gerne stattdessen unten in BlocklyDrawer nutzen in Verbindung mit dem auskommentierten Code oben. Aber dann funktioniert die Toolbox nicht mehr
  render() {
    return (
      <div>
        <BlocklyDrawer
      language={Blockly.Python}
      tools={[helloWorld, kNearNeigh]}
      onChange={(code, workspace) => {
        // das sollte ja auch eigentlich so gehen, führt aber zum selben Fehler wie das ganze in einer extra Funktion
        //this.setState({ pythonCode: code});
        console.log(code);
      }}
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
        <Block type="controls_if"/>
        <Block type="logic_compare"/>
        <Block type="controls_repeat_ext"/>
        <Block type="math_arithmetic"/>
        <Block type="text"/>
        <Block type="text_print"/>
        <Block type="math_number" />
      </Category>
      <Category name="Values">
        <Block type="math_number" />
        <Block type="text" />
      </Category>
    </BlocklyDrawer>
    <Button onClick={this.handleClick}>Click me!</Button>
      </div>
    );
  }

}

export default App;
