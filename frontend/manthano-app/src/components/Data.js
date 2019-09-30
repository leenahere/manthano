import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';
import DataVisualization from './DataVisualization';
import {Tab, Tabs, Table} from 'react-bootstrap';
import DataPreprocessing from './DataPreprocessing';
import convertCSVToArray from 'convert-csv-to-array';
import Loader from 'react-loader-spinner';
import { withTranslation, Translation  } from 'react-i18next';

class Data extends Component {
  state = {
    loadedCSV: "",
    loadedCSVArray: [],
    selectedData: "",
    plot: "",
    plotid: "",
    showPlot: false,
    exampleCSVList: [],
    robotCSVList: this.props.csvList.length == 0 ? [] : this.props.csvList,
    robotCSVContents: this.props.csvContents,
    robotCSVDelimiters: this.props.delimiters,
    connection: this.props.connection,
    delimiter: "",
    dndList: {},
    loadingHeatmap: false,
    heatmap: "",
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.connection != nextProps.connection) {
      if (nextProps.connection == 3) {
        this.setState({
            robotCSVList: nextProps.csvList,
            robotCSVContents: nextProps.csvContents,
            robotCSVDelimiters: nextProps.delimiters,
            connection: nextProps.connection
          });
      } else {
        this.setState({
          robotCSVList: ['Connect to robot to display data'],
          connection: nextProps.connection
        })
      }
    }
  }

  componentDidMount() {
    axios.get('http://'  + window.location.hostname + ':80/api/exampledata/list')
    .then(res => this.setState({
        exampleCSVList: res.data
      }))
    .catch(error => {
      console.log(error);
    });

  }

  getHeatmap = (csv, delimiter, session) => {
    this.setState({ loadingHeatmap: true, error: ""}, () => {
      axios.get('http://'  + window.location.hostname + ':80/api/heatmap/' + encodeURIComponent(csv) + '/' + delimiter + '/' + session, { responseType: 'arraybuffer' })
      .then(res => {
        console.log(res.data);
        const base64 = btoa(
            new Uint8Array(res.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          );
        console.log(base64);
        this.setState({
          heatmap: "data:;base64," + base64,
          loadingHeatmap: false,
        })})
      .catch(error => {
        this.setState({
          loadingHeatmap: false,
        })
        console.log(error);
      });
    });
  }

  handleClickExample = (e) => {
    this.setState({
        selectedData: e.currentTarget.id,
    });
    axios.get('http://'  + window.location.hostname + ':80/api/exampledata/file/' + e.currentTarget.id)
    .then(res => {
      const i =  res.data.csv.split("\n")[0];
      const j = i.split(res.data.delimiter);
      const l = [];
      for (var item in j) {
        const id = "data-" + item;
        l.push(
          {id: "data-" + item, name: j[item]}
        );
      }
      const dict = {};
      for (var item in l) {
        const d = "data-" + item;
        dict[d] = l[item];
      }
      this.setState({
        loadedCSV: res.data.csv,
        delimiter: res.data.delimiter,
        loadedCSVArray: convertCSVToArray(res.data.csv, {type: 'array', separator: res.data.delimiter,}),
        dndList: dict
      });
      this.getHeatmap(res.data.csv, res.data.delimiter, this.props.session);
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleClickRobot = (e) => {
    this.setState({
        selectedData: e.currentTarget.id,
    });
    console.log(this.state.robotCSVList.indexOf(e.currentTarget.id));
    let contentIndex = this.state.robotCSVList.indexOf(e.currentTarget.id);
    let resCSV = this.state.robotCSVContents[contentIndex];
    console.log(resCSV)
    let resDel = this.state.robotCSVDelimiters[contentIndex];
    console.log(resDel)
    const i =  resCSV.split("\n")[0];
    const j = i.split(resDel);
    const l = [];
    for (var item in j) {
      const id = "data-" + item;
      l.push(
        { id: "data-" + item, name: j[item] }
      );
    }
    const dict = {};
    for (var item in l) {
      const d = "data-" + item;
      dict[d] = l[item];
    }

    this.setState({
      loadedCSV: resCSV,
      delimiter: resDel,
      loadedCSVArray: convertCSVToArray(resCSV, { type: 'array', separator: resDel, }),
      dndList: dict,
    });
    this.getHeatmap(resCSV, resDel, this.props.session);
  }

  handOver = () => {
    this.props.forceUpdate();
  }

  render() {
    console.log(this.props);
    console.log(this.state.delimiter);

    let { t } = this.props;

    const exampleData = this.state.exampleCSVList;
    let exampleDataList = exampleData.map((obj, id) => {
      return (<tr id={obj.data_name} onClick={this.handleClickExample} style={{cursor: 'pointer'}}>
                <th>{obj.data_name}</th>
              </tr>);
    });

    console.log(this.state);
    const robotData = this.state.robotCSVList;
    let robotDataList;
    if (robotData.length == 0) {
      robotDataList = <span>{t("data.table.connect")}</span>;
    } else {
      robotDataList = robotData.map((obj, id) => {
        console.log(obj)
        return (<tr id={obj} onClick={this.handleClickRobot} style={{cursor: 'pointer'}}>
                  <th>{obj}</th>
                </tr>);
      });
    }
    

    let tablecontent;

    if (this.state.loadedCSV.length != 0) {
      tablecontent = <CsvToHtmlTable
                        data={this.state.loadedCSV}
                        csvDelimiter={this.state.delimiter}
                        tableClassName="table table-striped table-hover"
                      />;
    } else {
      tablecontent = <span>{t("data.selectionprompt")}</span>;
    }

    let exampleList = [];
    for (var item in exampleData) {
      exampleList.push({
            from: "example", data: exampleData[item].data_name
          });
    }

    let robotList = [];
    for (var item in this.state.robotCSVList) {
      robotList.push({
            from: "robot", data: this.state.robotCSVList[item]
          });
    }

    const allData = (this.state.connection === 3) ? exampleList.concat(robotList) : exampleList;

    let heatmap;

    if (this.state.loadingHeatmap == true) {
      heatmap = <Loader type="Oval" color="#a8a8a8" height={80} width={80} />
    } else {
      if (this.state.heatmap == "") {
        heatmap = <span>{t("data.selectionpromptheatmap")}</span>
      } else {
        heatmap = <img src={this.state.heatmap} />
      }
    }

    return (
      <div className="container" style={{ marginLeft: 1, marginRight: 1 }}>
        <div className="row" style={{ width: '100vw'}}>
          <div className="col-2">
            <Table hover>
              <thead>
                <tr>
                  <th>
                    {t("data.table.example")}
                  </th>
                </tr>
              </thead>
              <tbody>
                { exampleDataList }
              </tbody>
            </Table>
            <Table hover>
              <thead>
                <tr>
                  <th>
                  {t("data.table.robot")}
                  </th>
                </tr>
              </thead>
              <tbody>
                { robotDataList }
              </tbody>
            </Table>
          </div>
          <div className="col-10">
            <Tabs
             id="controlled-tab-example"
             activeKey={this.state.key}
             onSelect={key => this.setState({ key })}
           >
             <Tab eventKey="home" title={t("data.tabs.data")}>
                 <div style={{height: 'calc(100vh - 210px)', overflowY: 'scroll', overflowX: 'scroll'}}>
                     {tablecontent}
                 </div>
             </Tab>
             <Tab eventKey="heatmap" title={t("data.tabs.heatmap")}>
               <div style={{height: 'calc(100vh - 210px)', overflowY: 'scroll', overflowX: 'scroll'}}>
                   { heatmap }
               </div>
             </Tab>
             <Tab eventKey="plot" title={t("data.tabs.plot")}>
                 <div style={{height: 'calc(100vh - 210px)', overflowY: 'scroll', overflowX: 'scroll'}}>
                     <DataVisualization csv={this.state.loadedCSV} list={this.state.dndList} delimiter={this.state.delimiter} session={this.props.session} />
                 </div>
             </Tab>
             <Tab eventKey="enhance" title={t("data.tabs.preprocessing")}>
                <div style={{height: 'calc(100vh - 210px)', overflowY: 'scroll', overflowX: 'scroll'}}>
                 <DataPreprocessing forceUpdate={this.handOver} dataList={allData} session={this.props.session} csvList={this.props.csvList} csvContents={this.props.csvContents} delimiters={this.props.delimiters}/>
                </div>
             </Tab>
           </Tabs>
         </div>
        </div>
      </div>
    );
  }
}

Data.propTypes = {
  forceUpdate: PropTypes.func.isRequired,
  session: PropTypes.string.isRequired,
  csvList: PropTypes.array.isRequired,
  csvContents: PropTypes.array.isRequired,
  delimiters: PropTypes.array.isRequired,
  connection: PropTypes.string.isRequired
}

export default withTranslation(['translations'])(Data);
