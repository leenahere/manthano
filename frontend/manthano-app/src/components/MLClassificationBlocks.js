import Blockly from 'node-blockly/browser';

const classificationColor = 56;

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
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("solver")
        .appendField(new Blockly.FieldDropdown([["lbfgs","lbfgs"], ["liblinear", "liblinear"], ["newtoncg", "newton-cg"], ["saga", "saga"]]), "solver");
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
    var problemValue = block.getFieldValue('problem');
    var solverValue = block.getFieldValue('solver');
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var problemString = 'multi_class=\'' + problemValue + '\', ';
    var solverString = 'solver=\'' + solverValue + '\', ';
    var code = 'classification\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = LogisticRegression(' + problemString + solverString + ')';
    return code;
  },
};

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
    var typeValue = block.getFieldValue('type');
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var code = 'classification\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel =' + typeValue;
    return code;
  },
};

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
        .appendField(new Blockly.FieldDropdown([["linear","linear"], ["poly", "poly"], ["rbf", "rbf"], ["sigmoid", "sigmoid"]]), "kernel");
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
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var kernelString = 'kernel=\'' + kernelValue + '\', ';
    var degreeString = 'degree=' + degreeValue;
    if (kernelValue != 'poly') {
      var code = 'classification\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = SVC(' + kernelString + 'gamma=\'auto\')';
    } else {
      var code = 'classification\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = SVC(' + kernelString + degreeString + ', gamma=\'auto\')';
    }

    return code;
  },
};

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
        .appendField("criterion")
        .appendField(new Blockly.FieldDropdown([["gini","gini"], ["entropy", "entropy"]]), "criterion");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("splitter")
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
    var criterionValue = block.getFieldValue('criterion');
    var splitterValue = block.getFieldValue('splitter');
    var depthValue = Blockly.Python.valueToCode(block, 'depth', Blockly.Python.ORDER_ATOMIC);
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    var criterionString = 'criterion=\'' + criterionValue + '\', ';
    var splitterString = 'splitter=\'' + splitterValue + '\', ';
    var depthString = 'max_depth=' + depthValue;
    var code = 'classification\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = DecisionTreeClassifier(' + criterionString + splitterString + depthString + ')';
    return code;
  },
};

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
          .appendField(new Blockly.FieldDropdown([["euclidean","euclidean"], ["manhattan","manhattan"], ["chebyshev","chebyshev"], ["minkowski","minkowski"]]), "distance");
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
    var code = 'classification\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = KNeighborsClassifier(' + kString + distanceString + weightsString + ')';
    return code;
  },
};
