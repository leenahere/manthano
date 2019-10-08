import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Button, Form} from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Slider from '@material-ui/core/Slider';
import DragDrop from './DataDragNDrop';
import { withTranslation, Translation  } from 'react-i18next';

const apiURL = 'http://'  + window.location.hostname + ':8080/api/';

class DataPreprocessing extends Component {
  state = {
    scaler: "None",
    selectedData: "",
    dndList: {},
    dataList: this.props.dataList,
    checkboxChecked: false,
    dataName: "",
    trData: 70,
    testData: 30,
    features: [],
    labels: [],
    selectedCSV: "",
    selectedDel: "",
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        dataList: nextProps.dataList
      });
  }

  saveSettings = (e) => {
    e.preventDefault();
    var locationUrl = apiURL + 'data';
    axios.post(locationUrl, {
      session_id: this.props.session,
      data_name: this.state.dataName,
      csv: this.state.selectedCSV,
      scale: this.state.scaler,
      shuffle: this.state.checkboxChecked,
      test: this.state.testData,
      train: this.state.trData,
      features: this.state.features,
      labels: this.state.labels,
      delimiter: this.state.selectedDel
    })
    .then(res => {
      console.log(res);
      if (res.status == 200) {
        alert("Your configured dataset was successfully sent. You can now use it to train your models");
      } else {
        alert("Something went wrong. Please try to configure the data again and make sure to fill out all necessary information.");
      }
    })

    this.props.forceUpdate();
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

  _onSelectData = (e) => {
    const dropdownList = this.state.dataList;
    const background = dropdownList.find(item => item.data === e.value);
    if (background.from === "example") {
      axios.get(apiURL + 'exampledata/file/' + e.value)
      .then(res => {
        this.setState({
          selectedCSV: res.data.csv,
          selectedDel: res.data.delimiter
        })
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
          selectedData: e.value,
          dndList: dict
        });
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      let contentIndex = this.props.csvList.indexOf(e.value)
      console.log(contentIndex)
      let resCSV = this.props.csvContents[contentIndex];
      console.log(resCSV)
      let resDel = this.props.delimiters[contentIndex];
      console.log(resDel)
      this.setState({
        selectedCSV: resCSV,
        selectedDel: resDel
      })
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
        selectedData: e.value,
        dndList: dict
      });
    }
    this.setState({
      selectedData: e.value
    })
  }

  myCallback = (featureList, labelList) => {
    this.setState({
      features: featureList,
      labels: labelList
    });
  }

  render() {
    let { t } = this.props;
    console.log(this.state);
    const options = ['None', 'Standard', 'MinMax', 'Normalization'];
    const defaultOption = this.state.scaler;
    let dataOptions = [];
    for (var item in this.state.dataList) {
      dataOptions.push(
        this.state.dataList[item].data
      )
    }
    return(
      <div>
      <div>
        <label>{t("preprocessing.datalabel")}</label>
        <Dropdown options={dataOptions} onChange={this._onSelectData} value={this.state.selectedData} placeholder={t("preprocessing.dropdowndefault")} />
      </div>
      <b><em>{t("preprocessing.explanationdnd")}</em></b>
      <DragDrop list={this.state.dndList} callbackFromParent={this.myCallback}/>
      <div>
        <label>{t("preprocessing.scalelabel")}</label>
        <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder={t("preprocessing.scaledropdown")} />
      </div>
      <div>
      </div>
      <div>
        <Form onSubmit={this.saveSettings}>
          <Form.Row>
            <Form.Label>{t("preprocessing.name")}</Form.Label>
            <Form.Control
              onChange={this.handleNameChange}
              required
              type="text"
              placeholder={t("preprocessing.nameplaceholder")}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>{t("preprocessing.percentage")}</Form.Label>
              <Form.Label>Training {this.state.trData}</Form.Label>
              <Slider onChange={this.splitChange} defaultValue={70} min={0} max={100} step={10} marks aria-labelledby="discrete-slider" />
              <Form.Label>Test {this.state.testData}</Form.Label>
          </Form.Row>
          <Form.Group id="formGridCheckbox">
            <Form.Check checked={this.state.checkboxChecked} onChange={this.handleChange} type="checkbox" label={t("preprocessing.checkbox")} />
          </Form.Group>
          <Button variant="primary" type="submit">
          {t("preprocessing.submit")}
          </Button>
        </Form>
      </div>
      </div>

    )
  }
}

DataPreprocessing.propTypes = {
  forceUpdate: PropTypes.func.isRequired,
  session: PropTypes.string.isRequired,
  dataList: PropTypes.array.isRequired,
  csvList: PropTypes.array.isRequired,
  csvContents: PropTypes.array.isRequired,
  delimiters: PropTypes.array.isRequired,
}

export default withTranslation(['translations'])(DataPreprocessing)
