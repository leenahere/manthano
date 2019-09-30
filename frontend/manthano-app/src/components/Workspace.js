import React, { Component } from 'react';
import BlocklyWorkspace from './BlocklyWorkspace';
import {Tab, Tabs} from 'react-bootstrap';
import Data from './Data';
import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from 'prop-types';
import ModelResults from './ModelResults';
import { withTranslation, Translation  } from 'react-i18next';

class Workspace extends Component {
  state = {
    pythonCode: '',
    key: 'blockly',
    forceBlocklyUpdate: false
  }

  // This callback is necessary to force an update of the blockly workspace, if the user added new data, so it can be added to the data list in the data block
  updateForceUpdate = () => {
    this.setState({
      forceBlocklyUpdate: !this.state.forceBlocklyUpdate,
    })
  }

  // Handles update of the model code generated in the Blockly Workspace to hand it over to the ModelResult component
  updateCode= (code) => {
    this.setState({
      pythonCode: code,
    })
  }

  render() {
    // Returns the Blockly Workspace and ModelResult component, in the second Tab it returns the Data Analysis Component
    console.log(this.props);
    let { t } = this.props;

    return (
      <div>
        <Tabs
         id="controlled-tab-example"
         activeKey={this.state.key}
         onSelect={key => this.setState({ key })}
       >
         <Tab eventKey="blockly" title={t("workspace.tab1")}>
           <div style={{display: 'flex', height: 'calc(100vh - 210px)', width: '100vw'}}>
             <div style={{ display: 'flex', flexDirection: 'column', width: '55%' }}>
               <BlocklyWorkspace language={this.props.language} updateCode={ this.updateCode } pythonCode={ this.state.pythonCode } forceUpdate= { this.state.forceBlocklyUpdate } session={this.props.session}/>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
               <ModelResults trainedModel={this.props.trainedModel} forceUpdate={ this.state.forceBlocklyUpdate } code={ this.state.pythonCode } session={this.props.session} />
             </div>
           </div>
         </Tab>
         <Tab eventKey="data" title={t("workspace.tab2")}>
           <Data forceUpdate={this.updateForceUpdate} session={this.props.session} csvList={this.props.csvList} csvContents={this.props.csvContents} delimiters={this.props.delimiters} connection={this.props.connection}/>
         </Tab>
       </Tabs>
      </div>
    );
  }

}

Workspace.propTypes = {
  session: PropTypes.string.isRequired,
  csvList: PropTypes.array.isRequired,
  csvContents: PropTypes.array.isRequired,
  delimiters: PropTypes.array.isRequired,
  connection: PropTypes.string.isRequired,
  trainedModel: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
}

export default withTranslation(['translations'])(Workspace);
