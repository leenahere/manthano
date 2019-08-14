import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';
import DataVisualization from './DataVisualization';
import Button from 'react-bootstrap/Button';
import {Tab, Tabs, Table} from 'react-bootstrap';
import DataSettings from './DataSettings';
import convertCSVToArray from 'convert-csv-to-array';
import convertArrayToCSV from 'convert-array-to-csv';

class Data extends Component {
  state = {
    loadedCSV: "",
    loadedCSVArray: [],
    selectedData: "",
    plot: "",
    plotid: "",
    showPlot: false,
    exampleCSVList: [],
    robotCSVList: ['Connect to robot to display data'],
    connection: this.props.connection,
    delimiter: ""
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.connection != nextProps.connection) {
      if (nextProps.connection == 3) {
        axios.get('http://'  + window.location.hostname + ':80/api/robotdata/list/' + this.props.ip + '/' + this.props.user + '/' + this.props.pw)
        .then(res => this.setState({
            robotCSVList: res.data,
            connection: nextProps.connection
          }))
        .catch(error => {
          console.log(error);
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

  handleClickExample = (e) => {
    this.setState({
        selectedData: e.currentTarget.id,
    });
    axios.get('http://'  + window.location.hostname + ':80/api/exampledata/file/' + e.currentTarget.id)
    .then(res => {
      this.setState({
        loadedCSV: res.data.csv,
        delimiter: res.data.delimiter,
        loadedCSVArray: convertCSVToArray(res.data.csv, {type: 'array', separator: res.data.delimiter,}),
      });
      axios.get('http://'  + window.location.hostname + ':80/api/plot/' + encodeURIComponent(res.data.csv) + '/' + res.data.delimiter + '/' + this.props.session, { responseType: 'arraybuffer' })
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
          plot: "data:;base64," + base64,
          showPlot: true,
        })})
      .catch(error => {
        console.log(error);
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleClickRobot = (e) => {
    this.setState({
        selectedData: e.currentTarget.id,
    });
    axios.all([
      axios.get('http://'  + window.location.hostname + ':80/api/robotdata/file/' + this.props.ip + '/' + this.props.user + '/' + this.props.pw + '/' + e.currentTarget.id),
      axios.get('http://'  + window.location.hostname + ':80/api/robotdata/delimiter/' + this.props.ip + '/' + this.props.user + '/' + this.props.pw + '/' + e.currentTarget.id)
    ])
    .then(axios.spread((resCSV, resDel) => {
      this.setState({
        loadedCSV: resCSV.data,
        delimiter: resDel.data,
        loadedCSVArray: convertCSVToArray(resCSV.data, {type: 'array', separator: resDel.data,}),
      });
      axios.get('http://'  + window.location.hostname + ':80/api/plot/' + encodeURIComponent(resCSV.data) + '/' + resDel.data + '/' + this.props.session, { responseType: 'arraybuffer' })
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
          plot: "data:;base64," + base64,
          showPlot: true,
        })})
      .catch(error => {
        console.log(error);
      });
    }))
    .catch(error => {
      console.log(error);
    });
  }

  handOver = () => {
    this.props.forceUpdate();
  }

  render() {
    console.log(this.props);
    console.log(this.state.delimiter);
    const exampleData = this.state.exampleCSVList;
    let exampleDataList = exampleData.map((obj, id) => {
      return (<tr id={obj.data_name} onClick={this.handleClickExample} style={{cursor: 'pointer'}}>
                <th>{obj.data_name}</th>
              </tr>);
    });

    const robotData = this.state.robotCSVList;
    let robotDataList = robotData.map((obj, id) => {
      return (<tr id={obj} onClick={this.handleClickRobot} style={{cursor: 'pointer'}}>
                <th>{obj}</th>
              </tr>);
    });

    let tablecontent;

    if (this.state.loadedCSV.length != 0) {
      tablecontent = <CsvToHtmlTable
                        data={this.state.loadedCSV}
                        csvDelimiter={this.state.delimiter}
                        tableClassName="table table-striped table-hover"
                      />;
    } else {
      tablecontent = <h3>Select data to display</h3>;
    }

    let plotcontent;

    if (this.state.loadedCSV.length != 0) {
      // add key to DataVisualization to force a re-render, so that plots don't stack up
      plotcontent = <DataVisualization plot={this.state.plot} plotid={this.state.plotid}/>;
    } else {
      plotcontent = <h3>no plot, select data</h3>;
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

    return (
      <div className="container" style={{ marginLeft: 1, marginRight: 1 }}>
        <div className="row">
          <div className="col-xs-2">
            <Table hover>
              <thead>
                <tr>
                  <th>
                    Example Data
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
                    Robot Data
                  </th>
                </tr>
              </thead>
              <tbody>
                { robotDataList }
              </tbody>
            </Table>
          </div>
          <div className="col-md-10">
            <Tabs
             id="controlled-tab-example"
             activeKey={this.state.key}
             onSelect={key => this.setState({ key })}
           >
             <Tab eventKey="home" title="Table">
                {tablecontent}
             </Tab>
             <Tab eventKey="plot" title="Plot">
                {plotcontent}
             </Tab>
             <Tab eventKey="enhance" title="Preprocessing">
                <DataSettings forceUpdate={this.handOver} dataList={allData} session={this.props.session} ip={this.props.ip} user={this.props.user} pw={this.props.pw}/>
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
  ip: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  pw: PropTypes.string.isRequired,
  connection: PropTypes.string.isRequired
}

export default Data;
