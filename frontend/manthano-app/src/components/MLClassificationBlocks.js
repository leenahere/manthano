import Blockly from 'node-blockly/browser';
import axios from 'axios';

var testTrainDropdownList = [["X", "X"], ["y", "y"], ["X_train", "X_train"], ["y_train", "y_train"], ["X_test", "X_test"], ["y_test", "y_test"]]

const classificationColor = 56;
const regressionColor = 120;
const reinforcementColor = 140;
const neuralNetColor = 320;
const dataColor = 30;
const listColor = 190;

function getListsForDataBlock(dataDropdownList) {
  axios.get('http://'  + window.location.hostname + ':80/api/data/1234')
  .then(res => { for (var obj in res.data) {
    dataDropdownList.push([res.data[obj].data_name, res.data[obj].data_name])
  }
  console.log(dataDropdownList);
})
  .catch(error => {
    console.log(error);
  });
  return dataDropdownList;
}

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

export const logRegression = {
  name: 'logRegression',
  category: 'Classification',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Train Logistic Regression Model");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Problem")
        .appendField(new Blockly.FieldDropdown([["multinomial","multProblem"], ["binary", "binaryProblem"]]), "problem");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Solver")
        .appendField(new Blockly.FieldDropdown([["lbfgs","lbfgsSolver"], ["liblinear", "liblinearSolver"], ["newtoncg", "newtoncgSolver"], ["saga", "sagaSolver"]]), "solver");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var code = 'something';
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
        .appendField("Train Naive Bayes Model");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Type")
        .appendField(new Blockly.FieldDropdown([["Gaussian","gaussianType"], ["Multinomial", "nultinomialType"], ["Complement", "complementType"], ["Bernoulli", "bernoulliType"]]), "type");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var code = 'something';
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
        .appendField("Train Support Vector Machine");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Kernel")
        .appendField(new Blockly.FieldDropdown([["linear","linearKernel"], ["poly", "polyKernel"], ["rbf", "rbfKernel"], ["sigmoid", "sigmoidKernel"]]), "kernel");
      this.appendValueInput("degreePoly")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Degree for polynomial Kernel");
      this.appendValueInput("features")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Features");
      this.appendValueInput("labels")
        .setCheck("data")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var code = 'something';
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
        .appendField(new Blockly.FieldDropdown([["gini","giniCriterion"], ["entropy", "entropyCriterion"]]), "criterion");
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("splitter")
        .appendField(new Blockly.FieldDropdown([["best","bestSplitter"], ["random", "randomSplitter"]]), "splitter");
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
    var code = 'something';
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
        .appendField("Train K Nearest Neigbors Model");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Distance metric")
          .appendField(new Blockly.FieldDropdown([["euclidean","euclideanDistance"], ["manhattan","manhattanDistance"], ["chebyshev","chebyshevDistance"], ["minkowski","minkowskiDistance"]]), "distance");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Weights")
          .appendField(new Blockly.FieldDropdown([["uniform", "uniformWeights"], ["distance", "distanceWeights"]]), "weights");
      this.appendValueInput("k")
          .setCheck("Number")
          .setAlign(Blockly.ALIGN_LEFT)
          .appendField("Number of Neighbors to consider");
      this.appendValueInput("features")
          .setCheck("Data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Features");
      this.appendValueInput("labels")
          .setCheck("Data")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Labels");
      this.setInputsInline(false);
      this.setColour(classificationColor);
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

export const list = {
  name: 'list',
  category: 'List',
  block: {
    /**
    * Block for creating a list with any number of elements of any type.
    * @this Blockly.Block
    */
    init: function() {
      this.setColour(listColor);
      this.itemCount_ = 3;
      this.updateShape_();
      this.setOutput(true, 'list');
      this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    },
    /**
    * Create XML to represent list inputs.
    * @return {!Element} XML storage element.
    * @this Blockly.Block
    */
    mutationToDom: function() {
      var container = document.createElement('mutation');
      container.setAttribute('items', this.itemCount_);
      return container;
    },
    /**
    * Parse XML to restore the list inputs.
    * @param {!Element} xmlElement XML storage element.
    * @this Blockly.Block
    */
    domToMutation: function(xmlElement) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
      this.updateShape_();
    },
    /**
    * Populate the mutator's dialog with this block's components.
    * @param {!Blockly.Workspace} workspace Mutator's workspace.
    * @return {!Blockly.Block} Root block in mutator.
    * @this Blockly.Block
    */
    decompose: function(workspace) {
      var containerBlock = workspace.newBlock('lists_create_with_container');
      containerBlock.initSvg();
      var connection = containerBlock.getInput('STACK').connection;
      for (var i = 0; i < this.itemCount_; i++) {
        var itemBlock = workspace.newBlock('lists_create_with_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return containerBlock;
    },
    /**
    * Reconfigure this block based on the mutator dialog's components.
    * @param {!Blockly.Block} containerBlock Root block in mutator.
    * @this Blockly.Block
    */
    compose: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      // Count number of inputs.
      var connections = [];
      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
      }
      // Disconnect any children that don't belong.
      for (var i = 0; i < this.itemCount_; i++) {
        var connection = this.getInput('ADD' + i).connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
      this.itemCount_ = connections.length;
      this.updateShape_();
      // Reconnect any child blocks.
      for (var i = 0; i < this.itemCount_; i++) {
        Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
      }
    },
    /**
    * Store pointers to any connected child blocks.
    * @param {!Blockly.Block} containerBlock Root block in mutator.
    * @this Blockly.Block
    */
    saveConnections: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      var i = 0;
      while (itemBlock) {
        var input = this.getInput('ADD' + i);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        i++;
        itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock();
      }
    },
    /**
    * Modify this block to have the correct number of inputs.
    * @private
    * @this Blockly.Block
    */
    updateShape_: function() {
      if (this.itemCount_ && this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
        this.appendDummyInput('EMPTY')
        .appendField(Blockly.Msg['LISTS_CREATE_EMPTY_TITLE']);
      }
      // Add new inputs.
      for (var i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('ADD' + i)) {
          var input = this.appendValueInput('ADD' + i);
          if (i == 0) {
            input.appendField(Blockly.Msg['LISTS_CREATE_WITH_INPUT_WITH']);
          }
        }
      }
      // Remove deleted inputs.
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
  },
  generator: (block) => {
    var elements = new Array(block.itemCount_);
    console.log(elements);
    for (var i = 0; i < block.itemCount_; i++) {
      elements[i] = Blockly.Python.valueToCode(block, 'ADD' + i,
      Blockly.Python.ORDER_NONE) || 'None';
    }
    var code = '(' + elements.join(', ') + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
  }
}

export const mlp = {
  name: 'mlp',
  category: 'NeuralNets',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("train multi layer perceptron");
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
    // Print statement.
    var layerList = Blockly.Python.valueToCode(block, 'layers', Blockly.Python.ORDER_ATOMIC);
    var solverValue = block.getFieldValue('solver');
    var activationValue = block.getFieldValue('activation');
    var alphaValue = Blockly.Python.valueToCode(block, 'alpha', Blockly.Python.ORDER_ATOMIC);
    var maxIterValue = Blockly.Python.valueToCode(block, 'maxIter', Blockly.Python.ORDER_ATOMIC);
    var featuresValue = Blockly.Python.valueToCode(block, 'features', Blockly.Python.ORDER_ATOMIC);
    var labelsValue = Blockly.Python.valueToCode(block, 'labels', Blockly.Python.ORDER_ATOMIC);
    var featuresSplit = featuresValue.split("\n");
    var labelsSplit = labelsValue.split("\n");
    console.log(featuresSplit);
    //const code = 'print(' + msg + ')\n';
    //model = MLPClassifier(hidden_layer_sizes=(64,64,),max_iter=1000, solver='adam', activation='relu')
    //model.fit(X_train, y_train)
    var code = 'model = MLPClassifier(hidden_layer_sizes=' + layerList + ',max_iter=' + maxIterValue + ', solver=\''+solverValue+'\', activation=\''+ activationValue + '\')\n' +
                'model.fit(' + featuresSplit[1] +', '+labelsSplit[1]+')'
    //var code = 'print' + alphaValue + layerList + solverValue + activationValue + maxIterValue + featuresValue + labelsValue
    //return [code, Blockly.Python.ORDER_MEMBER];
    return code;
  },
};


export var dataBlock = {
  name: 'Data',
  category: 'Data',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("from data")
        .appendField(new Blockly.FieldDropdown(getListsForDataBlock([["iris", "iris"]])),'data');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("get")
        .appendField(new Blockly.FieldDropdown(testTrainDropdownList), "part");
      this.setOutput(true, "data");
      this.setInputsInline(true);
      this.setColour(dataColor);
      this.setTooltip("Data for the training the models");
      this.setHelpUrl("");
    },
  },
  generator: (block) => {
    var dataValue = block.getFieldValue('data');
    var partValue = block.getFieldValue('part');
    var code = dataValue + '\n' + partValue;
    console.log(code);
    return [code, Blockly.Python.ORDER_ATOMIC];
  },
}
