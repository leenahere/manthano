import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';
import DataVisualization from './DataVisualization';
import Button from 'react-bootstrap/Button';
import {Tab, Tabs, Table} from 'react-bootstrap';
import DataSettings from './DataSettings';

class Data extends Component {
  state = {
    csvlist: this.props.csvdata,
    loadedcsv: "",
    selectedData: "",
    plot: "",
    plotid: "",
    showPlot: false,
  }

  handleClick = (e) => {
    this.setState({
        selectedData: e.currentTarget.id,
    });
    axios.get('http://'  + window.location.hostname + ':80/api/csvdata/' + e.currentTarget.id)
    .then(res => this.setState({
        loadedcsv: res.data
      }))
    .catch(error => {
      console.log(error);
    });

    axios.get('http://'  + window.location.hostname + ':80/api/csvvisualization/' + e.currentTarget.id, { responseType: 'arraybuffer' })
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
  }

  render() {
    const loadedcsv = this.state.loadedcsv;
    const firstline = loadedcsv.split('\n')[0];
    let commas = (firstline.match(/,/g) || []).length;
    let features = [];
    for (var i = 0; i < commas; i++) {
      features.push(firstline.split(',')[i]);
    }

    const data = this.props.csvdata;
    let list = data.map((obj, id) => {
      return (<tr id={obj} onClick={this.handleClick} style={{cursor: 'pointer'}}>
                <th>{obj}</th>
              </tr>);
    });

    let tablecontent;

    if (this.state.loadedcsv.length != 0) {
      tablecontent = <CsvToHtmlTable
                        data={this.state.loadedcsv}
                        csvDelimiter=","
                        tableClassName="table table-striped table-hover"
                      />;
    } else {
      tablecontent = <h3>Select data to display</h3>;
    }

    let plotcontent;

    if (this.state.loadedcsv.length != 0) {
      // add key to DataVisualization to force a re-render, so that plots don't stack up
      plotcontent = <DataVisualization plot={this.state.plot} plotid={this.state.plotid}/>;
    } else {
      plotcontent = <h3>no plot, select data</h3>;
    }

    return (
      <div className="container" style={{ marginLeft: 1, marginRight: 1 }}>
        <div className="row">
          <div className="col-xs-2">
            <Table hover>
              <thead>
                <tr>
                  <th>
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                { list }
              </tbody>
            </Table>
            <div>
              <h4>Settings</h4>
              <DataSettings features={features} loadedcsv={this.state.loadedcsv}/>
            </div>
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
           </Tabs>
         </div>
        </div>
      </div>
    );
  }
}

Data.propTypes = {
  csvdata: PropTypes.array.isRequired,
}

export default Data;
