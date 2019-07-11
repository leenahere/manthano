import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';
import DataVisualization from './DataVisualization';
import Button from 'react-bootstrap/Button';
import {Tab, Tabs} from 'react-bootstrap';

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
        selectedData: e.target.id,
    });
    console.log(e.target.id);
    axios.get('http://'  + window.location.hostname + ':5000/api/csvdata/' + e.target.id)
    .then(res => this.setState({
        loadedcsv: res.data
      }))
    .catch(error => {
      console.log(error);
    });

    axios.get('http://'  + window.location.hostname + ':5000/api/csvvisualization/' + e.target.id)
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
      return <div id={obj} onClick={this.handleClick}>{obj}</div>
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
      plotcontent = <DataVisualization plot={this.state.plot} plotid={this.state.plotid}/>;
    } else {
      plotcontent = <h3>no plot, select data and click button</h3>;
    }

    return (
      <div>
        <h1>Data</h1>
        <div>{ list }</div>
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
    );
  }
}

Data.propTypes = {
  csvdata: PropTypes.array.isRequired,
}

export default Data;
