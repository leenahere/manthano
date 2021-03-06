import Blockly from 'node-blockly/browser';
import axios from 'axios';

// Dropdown list for data block. User needs to select if features or labels of data is needed.
var testTrainDropdownList = [["Merkmale", "X"], ["Kategorien", "y"]]

// Hue for data block and list block
const dataColor = 30;
const listColor = 195;

const apiURL = 'http://'  + window.location.hostname + ':8080/api/';

/**
 * This function gets all the data that was generated by the user in the data analysis tool. It's always called when the Blockly Workspace is updated.
 * This only happens when the user submitted new data to the db.
 */ 
function getListsForDataBlock(dataDropdownList) {
  axios.get(apiURL + 'data/' + localStorage.getItem('sessionID'))
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

// List Block for adding layers to the neural net blocks. Same as predefined Blockly List block with minor modifications like color and title
export const list = {
  name: 'list',
  category: 'NeuronaleNetze',
  block: {
    /**
    * Block for creating a list with any number of elements of any type.
    * @this Blockly.Block
    */
    init: function() {
      this.itemCount_ = 3;
      this.updateShape_();
      this.setOutput(true, 'list');
      this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
      this.setColour(listColor);
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
            input.appendField('Erzeuge Schichten');
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

// Data Block for ml models (features, labels)
export var dataBlock = {
  name: 'Data',
  category: 'Daten',
  block: {
    init: function () {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Aus Daten")
        .appendField(new Blockly.FieldDropdown(getListsForDataBlock([["irisBeispiel", "irisExample"]])),'data');
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("entnehme")
        .appendField(new Blockly.FieldDropdown(testTrainDropdownList), "part");
      this.setOutput(true, "data");
      this.setInputsInline(true);
      this.setColour(dataColor);
      this.setTooltip("Daten zum Trainieren der Modelle");
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
