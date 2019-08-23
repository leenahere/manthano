import Blockly from 'node-blockly/browser';
import axios from 'axios';

const classificationColor = 56;
const regressionColor = 120;
const reinforcementColor = 140;
const neuralNetColor = 320;
const dataColor = 30;
const listColor = 190;

export const mlp = {
  name: 'mlp',
  category: 'NeuralNets',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train multi layer perceptron");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("problem class")
          .appendField(new Blockly.FieldDropdown([["classification","classification"], ["regression","regression"]]), "problem");
      this.appendValueInput("layers")
          .setCheck("list")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("layers");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("solver")
          .appendField(new Blockly.FieldDropdown([["lbfgs","lbfgs"], ["adam","adam"], ["sgd","sgd"]]), "solver");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("activation")
          .appendField(new Blockly.FieldDropdown([["identity", "identity"], ["logistic", "logistic"], ["tanh", "tanh"], ["relu", "relu"]]), "activation");
      this.appendValueInput("alpha")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("alpha");
      this.appendValueInput("maxIter")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("maximum iterations");
      this.appendValueInput("features")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("features");
      this.appendValueInput("labels")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("labels");
      this.setInputsInline(false);
      this.setColour(neuralNetColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    console.log(block);
    var problemValue = Blockly.Python.valueToCode(block, 'problem', Blockly.Python.ORDER_ATOMIC);
    var layerList = Blockly.Python.valueToCode(block, 'layers', Blockly.Python.ORDER_ATOMIC);
    var solverValue = block.getFieldValue('solver');
    var activationValue = block.getFieldValue('activation');
    var alphaValue = Blockly.Python.valueToCode(block, 'alpha', Blockly.Python.ORDER_ATOMIC);
    var maxIterValue = Blockly.Python.valueToCode(block, 'maxIter', Blockly.Python.ORDER_ATOMIC);
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    if (problemValue == 'classification') {
      return 'classification\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = MLPClassifier(hidden_layer_sizes=' + layerList + ',max_iter=' + maxIterValue + ', solver=\''+solverValue+'\', activation=\''+ activationValue + '\')';
    } else {
      return 'regression\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = MLPRegressor(hidden_layer_sizes=' + layerList + ',max_iter=' + maxIterValue + ', solver=\''+solverValue+'\', activation=\''+ activationValue + '\')';
    }
  },
};
