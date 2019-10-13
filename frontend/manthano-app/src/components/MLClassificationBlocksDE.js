import Blockly from 'node-blockly/browser';

// Hue for classification blocks
const classificationColor = 48;

// Logistic Regression block that converts to sklearn.linear_model.LogisticRegression
export const logRegression = {
  name: 'logRegression',
  category: 'Klassifikation',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Trainiere logistische Regression");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Problem")
        .appendField(new Blockly.FieldDropdown([["multinomial","multinomial"], ["binär", "ovr"]]), "problem");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Merkmale");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Kategorien");
      this.setInputsInline(false);
      this.setColour(classificationColor);
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
  category: 'Klassifikation',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Trainiere naiven Bayes-Klassifikator");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Typ")
        .appendField(new Blockly.FieldDropdown([["Gauß","GaussianNB()"], ["Multinomial", "MultinomialNB()"], ["Komplement", "ComplementNB()"], ["Bernoulli", "BernoulliNB()"]]), "type");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Merkmale");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Kategorien");
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
  category: 'Klassifikation',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Trainiere Support Vector Maschine");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Kernel")
        .appendField(new Blockly.FieldDropdown([["linear","linear"], ["poly", "poly"], ["rbf", "rbf"]]), "kernel");
      this.appendValueInput("degreePoly")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Grad für polynomiellen Kernel");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Merkmale");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Kategorien");
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
  category: 'Klassifikation',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Trainiere Entscheidungsbaum");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Klassifikationkriterum")
        .appendField(new Blockly.FieldDropdown([["Gini","gini"], ["Entropie", "entropy"]]), "criterion");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Teilungsstrategie")
        .appendField(new Blockly.FieldDropdown([["Beste","best"], ["Zufällig", "random"]]), "splitter");
      this.appendValueInput("depth")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Tiefe");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Merkmale");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Kategorien");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var order = 1;
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
    var code = 'classification\n' + order +'\nimport_dataset(\"'+featuresSplit[0]+'\")\nmodel = DecisionTreeClassifier(' + criterionString + splitterString + depthString + ')';
    return code;
  },
};

// K nearest neighbors block that converts to sklearn.neighbors.KNeighborsClassifier
export const kNearNeigh = {
  name: 'kNearNeigh',
  category: 'Klassifikation',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Trainiere Nächste-Nachbarn-Klassifikator");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Abstandsmetrik")
          .appendField(new Blockly.FieldDropdown([["Euklid","euclidean"], ["Manhattan","manhattan"], ["Chebyshev","chebyshev"]]), "distance");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Gewichtung")
          .appendField(new Blockly.FieldDropdown([["Uniform", "uniform"], ["Distanz", "distance"]]), "weights");
      this.appendValueInput("k")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_LEFT)
          .appendField("Anzahl der berücksichtigten Nachbarn");
      this.appendValueInput("features")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Merkmale");
      this.appendValueInput("labels")
          .setCheck("data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Kategorien");
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
