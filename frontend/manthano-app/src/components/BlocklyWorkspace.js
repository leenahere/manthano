import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'node-blockly/browser';
import BlocklyDrawer, { Block, Category } from 'react-blockly-drawer';
import * as classblocks from './MLClassificationBlocks';
import * as helperblocks from './helperBlocks';
import * as regblocks from './MLRegressionBlocks';
import * as annblocks from './ANNBlocks';
import * as classblocksde from './MLClassificationBlocksDE';
import * as helperblocksde from './helperBlocksDE';
import * as regblocksde from './MLRegressionBlocksDE';
import * as annblocksde from './ANNBlocksDE';
import axios from 'axios';

/**
 * This is the BlocklyWorkspace component based mainly on react-blockly-drawer which is based on node-blockly/browser.
 * Most of the component's behavior is just the default behavior for a Blockly Workspace.
 */
class BlocklyWorkspace extends Component {
  /**
   * This Component should only update if the user submitted new data in the data analysis tool.
   * This is mainly because of a bug in the react-blockly-drawer which then just re-renders every time the user tries to open one of the tabs to add a block.
   * This leads to the foldout menu containing the blocks immediatley closing again which makes the whole workspace unusable.
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.forceUpdate === nextProps.forceUpdate && this.props.language === nextProps.language) {
      console.log("Blockly Workspace doesnt update");
      return false;
    }
    console.log("Blockly Workspace updates");
    return true;
  }

  state = {
    pythonCode: this.props.pythonCode,
    loading: false,
    resultData: "",
  }

  // Updates generated code every time the user adds/removes/drags blocks in the workspace and informs parent via updateCode callback
  handleChange = (code, workspace) => {
    this.setState({
      pythonCode: code,
    });
    this.props.updateCode(code);
  }

  render() {
    let workspace;
    // Since react i18n doesn't work with custom blockly blocks, the whole workspace is simply translated and re-rendered when the language is changed
    if (this.props.language == 'de' || this.props.language == 'de-DE') {
      workspace =  <BlocklyDrawer
                    style={{ height: '100%'}}
                    language={Blockly.Python}
                    tools={[classblocksde.kNearNeigh, classblocksde.logRegression, classblocksde.naiveBayes, classblocksde.svm, regblocksde.linRegression, regblocksde.polyRegression, classblocksde.decisionTree, annblocksde.mlp, helperblocksde.dataBlock, helperblocksde.list, regblocksde.kernelRidgeRegression, regblocksde.lassoRegression, regblocksde.elasticNetRegression]}
                    onChange={this.handleChange}
                    appearance={
                    {
                      categories: {
                        Klassifikation: {
                          colour: '48'
                        },
                        Daten: {
                          colour: '26'
                        },
                        NeuronaleNetze: {
                          colour: '330'
                        },
                        Regression: {
                          colour: '146'
                        }

                      },
                    }
                  }
                >
                  <Category name="Wert" colour='%{BKY_MATH_HUE}' >
                    <Block type="math_number" />
                  </Category>
                </BlocklyDrawer>
    } else {
      workspace = <BlocklyDrawer
                  style={{ height: '100%'}}
                  language={Blockly.Python}
                  tools={[classblocks.kNearNeigh, classblocks.logRegression, classblocks.naiveBayes, classblocks.svm, regblocks.linRegression, regblocks.polyRegression, classblocks.decisionTree, annblocks.mlp, helperblocks.dataBlock, helperblocks.list, regblocks.kernelRidgeRegression, regblocks.lassoRegression, regblocks.elasticNetRegression]}
                  onChange={this.handleChange}
                  appearance={
                    {
                      categories: {
                        Classification: {
                          colour: '48'
                        },
                        Data: {
                          colour: '26'
                        },
                        NeuralNets: {
                          colour: '330'
                        },
                        Regression: {
                          colour: '146'
                        }

                      },
                    }
                  }
                >
                  <Category name="Value" colour='%{BKY_MATH_HUE}' >
                    <Block type="math_number"/>
                  </Category>
                </BlocklyDrawer>
    }
    // Changes saturation and value of block colors in whole workspace
    Blockly.HSV_SATURATION = 0.9;
    Blockly.HSV_VALUE = 0.9;
    return (
      <div>
          { workspace }
      </div>
    );
  }

}

BlocklyWorkspace.propTypes = {
  updateCode: PropTypes.func.isRequired,
  pythonCode: PropTypes.string.isRequired,
  forceUpdate: PropTypes.bool.isRequired,
  session: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
}

export default BlocklyWorkspace;
