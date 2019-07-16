import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';
import DataVisualization from './DataVisualization';
import Button from 'react-bootstrap/Button';
import {Tab, Tabs, Table} from 'react-bootstrap';

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
    console.log("clicked!");
    console.log(e.currentTarget.id);
    this.setState({
        selectedData: e.currentTarget.id,
    });
    axios.get('http://'  + window.location.hostname + ':5000/api/csvdata/' + e.currentTarget.id)
    .then(res => this.setState({
        loadedcsv: res.data
      }))
    .catch(error => {
      console.log(error);
    });

    axios.get('http://'  + window.location.hostname + ':5000/api/csvvisualization/' + e.currentTarget.id)
    .then(res => this.setState({
        plotid: res.data[0],
        plot: res.data[1],
        showPlot: true,
      }))
    .catch(error => {
      console.log(error);
    });
  }

  handleButtonClick = () => {
    axios.get('http://'  + window.location.hostname + ':5000/api/csvvisualization/' + this.state.selectedData)
    .then(res => this.setState({
        plotid: res.data[0],
        plot: res.data[1],
        showPlot: true,
      }))
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    const data = this.props.csvdata;
    console.log(data);
    let list = data.map((obj, id) => {
      return (<tr id={obj} onClick={this.handleClick} style={{cursor: 'pointer'}}>
                <th>{obj}</th>
              </tr>);
      //<div id={obj} onClick={this.handleClick}>{obj}</div>
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
      plotcontent = <DataVisualization key={this.state.plotid} plot={this.state.plot} plotid={this.state.plotid}/>;
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
