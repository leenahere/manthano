import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';
import DataVisualization from './DataVisualization';
import {Tab, Tabs, Table, Select, ListGroup, Button, Form} from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import convertArrayToCSV from 'convert-array-to-csv';


class DataSettings extends Component {
  state = {
    scaler: "None",
    //initialfeatures: (this.props.csvarray === undefined || this.props.csvarray.length == 0) ? [] : this.props.csvarray[0],
    //features: (this.props.csvarray === undefined || this.props.csvarray.length == 0) ? [] : this.props.csvarray[0],
    csvArray: this.props.csvArray,
    checkboxChecked: false,
    dataName: "",
    trData: 70,
    testData: 30,
  }

  componentWillReceiveProps(nextProps) {
      //if (nextProps.)
      this.setState({
        //initialfeatures: (nextProps.csvarray === undefined || nextProps.csvarray.length == 0) ? [] : nextProps.csvarray[0],
        //features: (nextProps.csvarray === undefined || nextProps.csvarray.length == 0) ? [] : nextProps.csvarray[0],
        csvArray: nextProps.csvArray,
      });
  }

  saveSettings = (e) => {
    e.preventDefault();
    const header = this.state.csvArray[0];
    this.state.csvArray.shift();
    //console.log(this.state.csvArray);
    var locationUrl = 'http://'  + window.location.hostname + ':80/api/data';
    axios.post(locationUrl, {
      session_id: 1234,
      data_name: this.state.dataName,
      csv: convertArrayToCSV(this.state.csvArray, {header, separator: ';'}),
      scale: this.state.scaler,
      shuffle: this.state.checkboxChecked,
      test: this.state.testData,
      train: this.state.trData
    })
    .then(res => console.log(res))

    this.props.forceUpdate();

    //console.log(this.state.checkboxChecked);
    //console.log(this.state.dataName);
    //console.log(this.state.scaler);
    //console.log(this.state.trData);
    //console.log(this.state.testData);
  }

  handleChange = () => {
    this.setState({
      checkboxChecked: !this.state.checkboxChecked
    });
  }

  handleNameChange = (e) => {
    this.setState({
      dataName: e.target.value,
    })
  }

  splitChange = (e, newValue) => {
    this.setState({
      trData: newValue,
      testData: 100 - newValue,
    })
  }

  _onSelect = (e) => {
    this.setState({
      scaler: e.value
    })
  }
  render() {
    //console.log(this.state.checkboxChecked);
    const options = ['None', 'Standard', 'MinMax', 'Normalization'];
    const defaultOption = this.state.scaler;
    return(
      <div>
      <div>
        <label>Scale Data</label>
        <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
      </div>
      <div>
      </div>
      <div>
        <label><u>Save Data</u></label>
        <Form onSubmit={this.saveSettings}>
          <Form.Row>
            <Form.Label>Name for configured data</Form.Label>
            <Form.Control
              onChange={this.handleNameChange}
              required
              type="text"
              placeholder="dataset1"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>Percentage taken as test data</Form.Label>
              <Form.Label>Training {this.state.trData}</Form.Label>
              <Slider onChange={this.splitChange} defaultValue={70} min={0} max={100} step={10} marks aria-labelledby="discrete-slider" />
              <Form.Label>Test {this.state.testData}</Form.Label>
          </Form.Row>
          <Form.Group id="formGridCheckbox">
            <Form.Check checked={this.state.checkboxChecked} onChange={this.handleChange} type="checkbox" label="Shuffle data when splitting into training and text set" />
          </Form.Group>
          <Button variant="primary" type="submit">
              Submit
          </Button>
        </Form>
      </div>
      </div>

    )
  }
}

DataSettings.propTypes = {
  csvArray: PropTypes.array.isRequired,
  loadedcsv: PropTypes.string.isRequired,
  forceUpdate: PropTypes.func.isRequired,
}

export default DataSettings
