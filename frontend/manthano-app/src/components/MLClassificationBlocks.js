import Blockly from 'node-blockly/browser';

// Hue for classification blocks
const classificationColor = 48;

// Logistic Regression block that converts to sklearn.linear_model.LogisticRegression
export const logRegression = {
  name: 'logRegression',
  category: 'Classification',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train logistic regression model");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("problem")
        .appendField(new Blockly.FieldDropdown([["multinomial","multinomial"], ["binary", "ovr"]]), "problem");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var order = 1;
    var problemValue = block.getFieldValue('problem');
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var problemString = 'multi_class=\'' + problemValue + '\', ';
    var solverString = 'solver=\'lbfgs\', ';
    var code = 'classification\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = LogisticRegression(' + problemString + solverString + ')';
    return code;
  },
};

// Naive Bayes block that converts to sklearn.naive_bayes
export const naiveBayes = {
  name: 'naiveBayes',
  category: 'Classification',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train naive bayes model");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("type")
        .appendField(new Blockly.FieldDropdown([["Gaussian","GaussianNB()"], ["Multinomial", "MultinomialNB()"], ["Complement", "ComplementNB()"], ["Bernoulli", "BernoulliNB()"]]), "type");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var order = 1;
    var typeValue = block.getFieldValue('type');
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var code = 'classification\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel =' + typeValue;
    return code;
  },
};

// Support vector machine block that converts to sklearn.svm.SVC
export const svm = {
  name: 'svm',
  category: 'Classification',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train support vector machine");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("kernel")
        .appendField(new Blockly.FieldDropdown([["linear","linear"], ["poly", "poly"], ["rbf", "rbf"]]), "kernel");
      this.appendValueInput("degreePoly")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("degree for polynomial kernel");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var kernelValue = block.getFieldValue('kernel');
    var degreeValue = Blockly.Python.valueToCode(block, 'degreePoly', Blockly.Python.ORDER_ATOMIC);
    var order = degreeValue;
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var kernelString = 'kernel=\'' + kernelValue + '\', ';
    var degreeString = 'degree=' + degreeValue;
    if (kernelValue != 'poly') {
      var code = 'classification\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = SVC(' + kernelString + 'gamma=\'auto\')';
    } else {
      var code = 'classification\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = SVC(' + kernelString + degreeString + ', gamma=\'auto\')';
    }

    return code;
  },
};

// Decision Tree Block that converts to sklearn.tree.DecisionTreeClassifier
export const decisionTree = {
  name: 'decisionTree',
  category: 'Classification',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train decision tree");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("splitting strategy")
        .appendField(new Blockly.FieldDropdown([["best","best"], ["random", "random"]]), "splitter");
      this.appendValueInput("depth")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("depth");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var order = 1;
    var splitterValue = block.getFieldValue('splitter');
    var depthValue = Blockly.Python.valueToCode(block, 'depth', Blockly.Python.ORDER_ATOMIC);
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var criterionString = 'criterion=\'gini\', ';
    var splitterString = 'splitter=\'' + splitterValue + '\', ';
    var depthString = 'max_depth=' + depthValue;
    var code = 'classification\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = DecisionTreeClassifier(' + criterionString + splitterString + depthString + ')';
    return code;
  },
};

// K nearest neighbors block that converts to sklearn.neighbors.KNeighborsClassifier
export const kNearNeigh = {
  name: 'kNearNeigh',
  category: 'Classification',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train k-nearest neigbors model");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("distance metric")
          .appendField(new Blockly.FieldDropdown([["euclidean","euclidean"], ["manhattan","manhattan"], ["chebyshev","chebyshev"]]), "distance");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("weights")
          .appendField(new Blockly.FieldDropdown([["uniform", "uniform"], ["distance", "distance"]]), "weights");
      this.appendValueInput("k")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_LEFT)
          .appendField("number of neighbors to consider");
      this.appendValueInput("features")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("features");
      this.appendValueInput("labels")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var order = 1;
    var distanceValue = block.getFieldValue('distance');
    var weightsValue = block.getFieldValue('weights');
    var kValue = Blockly.Python.valueToCode(block, 'k', Blockly.Python.ORDER_ATOMIC);
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var kString = 'n_neighbors=' + kValue + ', ';
    var distanceString = 'metric=\'' + distanceValue + '\', ';
    var weightsString = 'weights=\'' + weightsValue + '\'';
    var code = 'classification\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = KNeighborsClassifier(' + kString + distanceString + weightsString + ')';
    return code;
  },
};
