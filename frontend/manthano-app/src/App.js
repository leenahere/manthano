import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Workspace from './components/Workspace';
import Loader from 'react-loader-spinner';
import Popup from 'reactjs-popup';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-dropdown';
import { withTranslation, Translation  } from 'react-i18next';
import Emoji from './components/Emoji';
import i18n from './i18n';
import './App.css';

const apiURL = 'http://'  + window.location.hostname + ':8080/api/';

// connection "enum" for connecting to a robot
const connection = {
  UNKNOWN: 1,
  UNUSCCESSFUL: 2,
  SUCCESSFUL: 3
}

// session ID generator
// TODO: check if good practice to just write this function here
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

class App extends Component {
  state = {
    sessionId: "",
    isLoaded: false,
    connectionLoading: false,
    ip: "",
    user: "",
    pw: "",
    connected: connection.UNKNOWN,
    showPopup: false,
    correctFormat: false,
    robotCSVList: [],
    robotCSVContent: [],
    CSVDelimiterList: [],
    successfulModelRun: false,
    pathToPickledModel: "",
    scriptList: [],
    runSuccess: false,
    modelName: "",
    language: "",
  }

  trainedModelAvailable = (path) => {
    this.setState({
      successfulModelRun: true,
      pathToPickledModel: path
    })
  }

  // Handles the IP address input field. Checks if IP has valid pattern
  handleChangeIp = (event) => {
    this.setState({ ip: event.target.value })
    if(event.target.value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      this.setState({
        correctIpFormat: true
      });
    } else {
      this.setState({
        correctIpFormat: false
      });
    }
  }

  // Handles the user input field
  handleChangeUser = (event) => {
    this.setState({
      user: event.target.value
    })
  }

  // Handles the password input field
  handleChangePw = (event) => {
    this.setState({
      pw: event.target.value
    })
  }

  handleChangeModelName = (event) => {
    this.setState({
      modelName: event.target.value
    })
  }

  // Handles Submission of connection form.
  handleSubmit = () => {
    // Backend checks if it can create a SFTP connection to robot and gets all necessary data from robot directories
    // TODO What happends if connection is lost in between? User won't have any feedback about lost connection. Could reconnect to robot every minute or so?
    this.setState({ connectionLoading: true, error: ""}, () => {
      axios.get(apiURL + 'connect/' + this.state.ip + '/' + this.state.user  + '/' + this.state.pw)
      .then(res => {
        console.log(res.data);
        this.setState({
          robotCSVList: res.data[1],
          robotCSVContent: res.data[2],
          CSVDelimiterList: res.data[3],
          scriptList: res.data[4],
          connected: (res.data[0] ? connection.SUCCESSFUL : connection.UNUSCCESSFUL),
          connectionLoading: false,
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          connectionLoading: false,
        });
      });
    });
  }

  handleRunScript = () => {
    console.log(this.state.sessionId)
    console.log(this.state.pathToPickledModel.concat(this.state.sessionId))
    axios.get(apiURL + 'runscript/' + this.state.ip + '/' + this.state.user  + '/' + this.state.pw + '/' + this.state.pathToPickledModel.concat(this.state.sessionId) + '/' + this.state.modelName + '/' + this.state.sessionId)
      .then(res => {
        console.log(res)
        this.setState({
          runSuccess: true
        })
      })
      .catch(error => {
        console.log(error);
        this.setState({
          runSuccess: false
        })
      });
  }

  changeToGer = () => {
    console.log("Deutsch");
    i18n.changeLanguage('de');
    this.setState({
      language: 'de',
    });
  }

  changeToEn = () => {
    console.log("Englisch");
    i18n.changeLanguage('en');
    this.setState({
      language: 'en',
    });
  }

  componentDidMount() {
    // Generate session ID and store it in local storage if not existent
    if(localStorage.getItem('sessionID') != null) {
      this.setState({
        sessionId: localStorage.getItem('sessionID'),
        isLoaded: true
      });
    } else {
      var guid = guidGenerator();
      console.log(guid);
      localStorage.setItem('sessionID', guid);
      this.setState({
        sessionId: guid,
        isLoaded: true
      });
    }

    i18n.changeLanguage(navigator.language);
    this.setState({
      language: navigator.language,
    });
    console.log(navigator.language);
  }

  render() {
    console.log(this.state);
    console.log(i18n.language);
    let ev3Connect;
    switch(this.state.connected) {
      case connection.UNKNOWN:
      ev3Connect = <span></span>
      break;
      case connection.UNUSCCESSFUL:
      ev3Connect = <Translation ns="translations">
                      {
                        (t, { i18n }) => <span class="alertL" style={{color: 'red'}}>{t("app.connection.unsuccessful")}</span>
                      }
                    </Translation>
      break;
      case connection.SUCCESSFUL:
      ev3Connect =<Translation ns="translations">
                      {
                        (t, { i18n }) => <span class="alertL" style={{color: 'green'}}>{t("app.connection.successful")}</span>
                      }
                  </Translation>
      break;
      default:
      ev3Connect = <Translation ns="translations">
                      {
                        (t, { i18n }) => <span style={{color: 'red'}}>{t("app.connection.default")}</span>
                      }
                   </Translation>
      break;
    }

    let sentModel;
    if(this.state.runSuccess == true) {
      sentModel = <Translation ns="translations">
                    {
                       (t, { i18n }) => <span style={{color: 'green'}}>{t("app.sendsuccess")}</span>
                    }
                  </Translation>
    } else {
      sentModel = <span></span>
    }

    let reloadRobotConnection;
    if(this.state.connected == 3) {
      reloadRobotConnection =<Button variant="light" onClick={this.handleSubmit}><Emoji symbol="🔄"/></Button>
    } else {
      reloadRobotConnection = <span></span>
    }

    let runModel;
    if(this.state.connected == 3) {
     runModel =  <div>
       <Popup
            trigger={<Button disabled={!(this.state.successfulModelRun && (this.state.connected == 3))} variant="light">
                      <Translation ns="translations">
                        {
                          (t, { i18n }) => <span>{t("app.sendmodel")}</span>
                         }
                       </Translation>
                    </Button>
                    }
            modal
            closeOnDocumentClick
            >
            {close => (
              <div>
                <form>
                  <label>
                    <Translation ns="translations">
                        {
                            (t, { i18n }) => <span>{t("app.modelname")}</span>
                        }
                    </Translation>
                    <input type="text" value={this.state.modelName} onChange={this.handleChangeModelName}/>
                  </label>
                  <Button onClick={() => {
                      close();
                      this.handleRunScript();
                    }} variant="light"><Translation ns="translations">
                    {
                      (t, { i18n }) => <span>{t("app.sendbutton")}</span>
                     }
                   </Translation></Button>
                  </form>
              </div>
            )}
          </Popup>
          { sentModel }
     </div>
    }

    // isLoaded is false if session ID hasn't been generated yet. Returns loading spinner if false
    const isLoaded = this.state.isLoaded;
    console.log(isLoaded);
    if (!isLoaded) {
      return(
        <div><Loader type="Oval" color="#somecolor" height={80} width={80} /></div>
      );
    } else {
      // Returns app heading, the connection button which opens a popup form and the workspace component
      return(
      <div>
        <div class="headerOfAppL">
          <div class="headerInnerOfAppL">
            <div class="leftL">
              <h1>&mu;anth&aacute;n&#333;</h1>
              <Translation ns="translations">
                {
                  (t, { i18n }) => <h2>{t("app.subtitle")}</h2>
                }
               </Translation>
            </div>
            <div class="rightL">

              <Button variant="light" onClick={this.changeToGer}><Emoji symbol="🇩🇪"/></Button>
              <Button variant="light" onClick={this.changeToEn}><Emoji symbol="🇺🇸"/></Button>

              <Popup
                trigger={<Button variant="light">
                          <Translation ns="translations">
                            {
                                (t, { i18n }) => <span>{t("app.connect")}</span>
                            }
                          </Translation>
                        </Button>
                        }
                modal
                closeOnDocumentClick
                >
                {close => (
                  <div>
                    <form>
                      <label class="ipAddressL">
                        <Translation ns="translations">
                            {
                                (t, { i18n }) => <span>{t("app.form.ip")}:</span>
                            }
                        </Translation>
                        <input type="text" value={this.state.ip} onChange={this.handleChangeIp}/>
                      </label>
                      <label>
                        <Translation ns="translations">
                            {
                                (t, { i18n }) => <span>{t("app.form.user")}:</span>
                            }
                        </Translation>
                        <input type="text" value={this.state.user} onChange={this.handleChangeUser}/>
                      </label>
                      <label>
                        <Translation ns="translations">
                            {
                                (t, { i18n }) => <span>{t("app.form.password")}:</span>
                            }
                        </Translation>
                        <input type="password" value={this.state.pw} onChange={this.handleChangePw}/>
                      </label>
                      <Button onClick={() => {
                          close();
                          this.handleSubmit();
                        }} disabled={!(this.state.correctIpFormat && (this.state.user.length > 0) && (this.state.pw.length > 0))} variant="light">
                          <Translation ns="translations">
                            {
                                (t, { i18n }) => <span>{t("app.form.submit")}</span>
                            }
                          </Translation>
                      </Button>
                      </form>
                      { this.state.correctIpFormat
                        ? <Translation ns="translations">
                            {
                              (t, { i18n }) => <span class="noteL" style={{color: 'green'}}>{t("app.form.validip")}</span>
                            }
                           </Translation>
                        : <Translation ns="translations">
                            {
                              (t, { i18n }) => <span class="noteL" style={{color: 'red'}}>{t("app.form.invalidip")}</span>
                            }
                           </Translation>
                    }
                  </div>
                )}
              </Popup>

              { this.state.connectionLoading ? <Loader type="Oval" color="#a8a8a8" height={80} width={80} /> : ev3Connect}

              <div class="roboConnectetL">
                <div>
                  { reloadRobotConnection }
                </div>
                <div>
                  { runModel }
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="mainAppL">
          <Workspace trainedModel={this.trainedModelAvailable} session={this.state.sessionId} connection={this.state.connected} csvList={this.state.robotCSVList} csvContents={this.state.robotCSVContent} delimiters={this.state.CSVDelimiterList} language={this.state.language}/>
        </div>
        
      </div>
    );
  }
}
}

export default withTranslation()(App);
