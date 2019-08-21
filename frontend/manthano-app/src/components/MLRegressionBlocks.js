import Blockly from 'node-blockly/browser';
import axios from 'axios';

const classificationColor = 56;
const regressionColor = 120;
const reinforcementColor = 140;
const neuralNetColor = 320;
const dataColor = 30;
const listColor = 190;

export const linRegression = {
  name: 'linRegression',
  category: 'Regression',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train linear regression");
      this.appendDummyInput()
        .appendField('multinomial output')
        .appendField(new Blockly.FieldCheckbox(false), 'multiOutput');
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Labels");
      this.setInputsInline(false);
      this.setColour(regressionColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var code = 'something';
    return code;
  },
}

export const polyRegression = {
  name: 'polyRegression',
  category: 'Regression',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train polynomial regression");
      this.appendDummyInput()
        .appendField('multinomial output')
        .appendField(new Blockly.FieldCheckbox(false), 'multiOutput');
      this.appendValueInput("degree")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("degree");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Labels");
      this.setInputsInline(false);
      this.setColour(regressionColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var code = 'something';
    return code;
  },
}
