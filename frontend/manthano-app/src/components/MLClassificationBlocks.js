import Blockly from 'node-blockly/browser';

export const kNearNeigh = {
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

export const helloWorld = {
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
    const code = "'Hello " + message + "'";
    return [code, Blockly.Python.ORDER_MEMBER];
  },
};
