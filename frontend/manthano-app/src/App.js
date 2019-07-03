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

// Extra Komponente nur für den Blockly-Teil
// Dann kansnt du das shouldComponentUpdate here auf false setzen
// (dh diese Komponente rendert *nie* neu)
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

// ...diese aber schon wenn sich der State oder Props ändern!
class App extends Component {
  // Du kannst den State auch so initialisieren, dann sparst du dir den
  // Konstruktor und den super(props) Aufruf
  state = {
    pythonCode: '',
  }

  // ...und wenn du die Event handler wie folgt spezifizierst, brauchst du nicht das .bind(this)
  // (ist quasi ein Klassenattribut, dem eine Arrow-Funktion zugewiesen wird. Die Arrow-Funktionen
  //  behalten den this-Kontext des Elternelements bei und man muss dieses deswegen nicht binden)
  handleClick = () => {
    console.log(this.state);
  }

  handleChange = (code, workspace) => {
    this.setState({
      pythonCode: code,
    });
  }


  //onChange={this.handleChange} das würde ich gerne stattdessen unten in BlocklyDrawer nutzen in Verbindung mit dem auskommentierten Code oben. Aber dann funktioniert die Toolbox nicht mehr
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
