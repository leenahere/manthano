import Blockly from 'node-blockly/browser';

// Hue for regression blocks
const regressionColor = 120;
const reinforcementColor = 140;

// Linear Regression block that converts to sklearn.linear_model.LinearRegression
export const linRegression = {
  name: 'linRegression',
  category: 'Regression',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train linear regression");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("labels");
      this.setInputsInline(false);
      this.setColour(regressionColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var code = 'regression\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = LinearRegression()';
    return code;
  },
}

// Polynomial Regression block that converts to sklearn.preprocessing.PolynomialFeatures and sklearn.linear_model.LinearRegression in a pipeline which is basically polynomial regression
export const polyRegression = {
  name: 'polyRegression',
  category: 'Regression',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train polynomial regression");
      this.appendValueInput("degree")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("degree");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("labels");
      this.setInputsInline(false);
      this.setColour(regressionColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var degreeValue = Blockly.Python.valueToCode(block, 'degree', Blockly.Python.ORDER_ATOMIC);
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var code = 'regression\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = Pipeline([(\'poly\', PolynomialFeatures(degree=' + degreeValue + ')), (\'linear\', LinearRegression(fit_intercept=False))])';
    return code;
  },
}
