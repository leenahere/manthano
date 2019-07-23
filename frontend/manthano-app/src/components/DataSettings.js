import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CsvToHtmlTable } from 'react-csv-to-table';
import DataVisualization from './DataVisualization';
import {Tab, Tabs, Table, Select, ListGroup, Button, Form} from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


class DataSettings extends Component {
  state = {
    scaler: "None",
    features: this.props.features,
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        features: nextProps.features
      });
  }

  handleClick = (e) => {
    console.log(e.currentTarget.id);
    let currentfeatures = this.state.features
    var index = currentfeatures.indexOf(e.currentTarget.id);
    if (index > -1) {
        currentfeatures.splice(index, 1);
    }
    this.setState({
      features: currentfeatures
    })
    console.log(this.state.features);
  }

  // doesnt really work yet
  handleReload = () => {
    this.setState({
      features: this.props.features
    })
  }

  _onSelect = (e) => {
    this.setState({
      scaler: e.value
    })
  }
  render() {
    console.log(this.state.features);
    let list = this.state.features.map((obj, id) => {
      return (<div style={{display: 'flex'}}><ListGroup.Item>{ obj }</ListGroup.Item>
              <Button id={obj} onClick={this.handleClick}>X</Button></div>);
    });
    console.log(this.state);
    const options = ['None', 'Standard', 'MinMax', 'Normalization'];
    const defaultOption = options[0];
    return(
      <div>
      <div>
        <label>Scale Data</label>
        <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
      </div>
      <div>
        <label>Drop Data</label>
        <Button onClick={this.handleReload}>Reload</Button>
        <ListGroup>
          { list }
        </ListGroup>
      </div>
      <div>
        <label><u>Save Data</u></label>
        <Form>
          <Form.Row>
            <Form.Label>Name for configured data</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="dataset1"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>Percentage taken as test data</Form.Label>
            <Form.Control
                required
                type="text"
                placeholder="20"
              />
          </Form.Row>
          <Form.Group id="formGridCheckbox">
            <Form.Check type="checkbox" label="Shuffle data when splitting into training and text set" />
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
  features: PropTypes.array.isRequired,
  loadedcsv: PropTypes.string.isRequired,
}

export default DataSettings
