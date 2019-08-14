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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Column from './Column';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

class DataDragNDrop extends Component {
  state = {
    features: [],
    labels: [],
    data: {},
    columns: {
      'column-1': {
        id: 'column-1',
        title: "Data",
        dataId: []
      },
      'column-2': {
        id: 'column-2',
        title: 'Features',
        dataId: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Labels',
        dataId: [],
      }
    },
    columnsort: ['column-1', 'column-2', 'column-3']
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.list != nextProps.list) {
      const arr = [];
      for (var item in nextProps.list) {
        arr.push(
          nextProps.list[item].id
        );
      }
      const newState = {
        ...this.state,
        data: nextProps.list,
        columns: {
          'column-1': {
            id: 'column-1',
            title: "Data",
            dataId: arr
          },
          'column-2': {
            id: 'column-2',
            title: 'Features',
            dataId: [],
          },
          'column-3': {
            id: 'column-3',
            title: 'Labels',
            dataId: [],
        }
      },
      columnsort: ['column-1', 'column-2', 'column-3']
    }
    this.setState(newState);
  }
  }

  onDragEnd = result => {
    const {destination, source, draggableId} = result;
    console.log(result);
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const begin = this.state.columns[source.droppableId];
    const end = this.state.columns[destination.droppableId];

    if (begin === end) {
      console.log("end and begin equal");
      const newDataIds = Array.from(begin.dataId);
      newDataIds.splice(source.index, 1);
      newDataIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...begin,
        dataId: newDataIds,
      };
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };
      this.setState(newState);
      return;
    }

    const beginDataIds = Array.from(begin.dataId);
    beginDataIds.splice(source.index, 1);
    const newBegin = {
      ...begin,
      dataId: beginDataIds
    };

    const endDataIds = Array.from(end.dataId);
    endDataIds.splice(destination.index, 0, draggableId);
    const newEnd = {
      ...end,
      dataId: endDataIds
    };

    console.log(newBegin);
    console.log(newEnd);

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newBegin.id]: newBegin,
        [newEnd.id]: newEnd,
      },
    };
    this.setState(newState);
    this.props.callbackFromParent(newState.columns['column-2'].dataId, newState.columns['column-3'].dataId);
  };

  render() {
    return(
    <div>
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columnsort.map(columnId => {
                const column = this.state.columns[columnId];
                const datas = column.dataId.map(dataId => this.state.data[dataId]);
                return <Column key={Column.id} column={column} data={datas} />;
              })}
        </Container>
      </DragDropContext>
    </div>
  );
  }
}

DataDragNDrop.propTypes = {
  list: PropTypes.object.isRequired,
  callbackFromParent: PropTypes.func.isRequired
}

export default DataDragNDrop
