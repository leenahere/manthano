import Blockly from 'node-blockly/browser';

export const kNearNeigh = {
  name: 'Blabla',
  category: 'Machine Learning',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Train K Nearest Neigbors Model");
      this.appendValueInput("features")
          .setCheck(["Array", "Number"])
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("X(Features)");
      this.appendValueInput("labels")
          .setCheck("Array")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Labels");
      this.appendValueInput("k")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_LEFT)
          .appendField("Number of Neighbors to consider");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Distance metric")
          .appendField(new Blockly.FieldDropdown([["euclidean","euclideanDistance"], ["manhattan","manhattanDistance"]]), "distance");
      this.setOutput(true, "knn");
      this.setInputsInline(false);
      this.setColour(15);
      this.setTooltip("");
      this.setHelpUrl("");
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
