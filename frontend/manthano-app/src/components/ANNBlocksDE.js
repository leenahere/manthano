import Blockly from 'node-blockly/browser';
import { withTranslation, Translation  } from 'react-i18next';

// Hue for neural net blocks
const neuralNetColor = 320;

// Multi Layer Perceptron block which converts to either sklearn.neural_network.MLPClassifier or sklearn.neural_network.MLPRegressor depending on the problem class given by the user
export const mlp = {
  name: 'mlp',
  category: 'NeuronaleNetze',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Trainiere mehrlagiges Perzeptron");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Problem")
          .appendField(new Blockly.FieldDropdown([["Klassifikation","classification"], ["Regression","regression"]]), "problem");
      this.appendValueInput("layers")
          .setCheck("list")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Schichten");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Lernalgorithmus")
          .appendField(new Blockly.FieldDropdown([["lbfgs","lbfgs"], ["adam","adam"], ["sgd","sgd"]]), "solver");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Aktivierungsfunktion")
          .appendField(new Blockly.FieldDropdown([["identity", "identity"], ["logistic", "logistic"], ["tanh", "tanh"], ["relu", "relu"]]), "activation");
      this.appendValueInput("alpha")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Lernrate");
      this.appendValueInput("maxIter")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Maximale Iterationen");
      this.appendValueInput("features")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Merkmale");
      this.appendValueInput("labels")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Kategorien");
      this.setInputsInline(false);
      this.setColour(neuralNetColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var order = 1;
    var problemValue = block.getFieldValue('problem');
    console.log(problemValue);
    var layerList = Blockly.Python.valueToCode(block, 'layers', Blockly.Python.ORDER_ATOMIC);
    var solverValue = block.getFieldValue('solver');
    console.log(solverValue);
    var activationValue = block.getFieldValue('activation');
    var alphaValue = Blockly.Python.valueToCode(block, 'alpha', Blockly.Python.ORDER_ATOMIC);
    var maxIterValue = Blockly.Python.valueToCode(block, 'maxIter', Blockly.Python.ORDER_ATOMIC);
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    if (problemValue == "classification") {
      return 'classification\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = MLPClassifier(hidden_layer_sizes=' + layerList + ',max_iter=' + maxIterValue + ', solver=\''+solverValue+'\', activation=\''+ activationValue + '\')';
    } else {
      return 'regression\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = MLPRegressor(hidden_layer_sizes=' + layerList + ',max_iter=' + maxIterValue + ', solver=\''+solverValue+'\', activation=\''+ activationValue + '\')';
    }
  },
};
