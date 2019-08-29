import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-dropdown/style.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Column from './Column';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

/**
 * Data DragNDrop component used for altering data for model and for plotting data.
 * Three Columns to drag around columns of dataset to add them as features or labels.
 * Followed this tutorial: https://blog.bitsrc.io/implement-better-drag-and-drop-in-your-react-app-beafc4451599
 */ 
class DataDragNDrop extends Component {
  state = {
    features: [],
    labels: [],
    data: this.props.list,
    columns: {
      'column-1': {
        id: 'column-1',
        title: "Data",
        dataId: this.arrayForDataId(this.props.list),
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

  // Transforms list of dataset columns into the right format for the columns dataId state
  arrayForDataId(list) {
    const arr = [];
    for (var item in list) {
      arr.push(
        list[item].id
      );
    }
    return arr;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list != nextProps.list) {
      const newState = {
        features: [],
        labels: [],
        data: nextProps.list,
        columns: {
          'column-1': {
            id: 'column-1',
            title: "Data",
            dataId: this.arrayForDataId(nextProps.list),
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

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newBegin.id]: newBegin,
        [newEnd.id]: newEnd,
      },
    };
    this.setState(newState);
    const featuresArr = [];
    for (var item in newState.columns['column-2'].dataId) {
      const num = newState.columns['column-2'].dataId[item].split("-");
      featuresArr.push(
        Number(num[1])
      )
    }
    featuresArr.sort(function(a, b){return a-b});
    const labelsArr = [];
    for (var item in newState.columns['column-3'].dataId) {
      const num = newState.columns['column-3'].dataId[item].split("-");
      labelsArr.push(
        Number(num[1])
      )
    }
    labelsArr.sort(function(a, b){return a-b});
    this.props.callbackFromParent(featuresArr, labelsArr);
  };

  render() {
    console.log(this.props);
    console.log(this.state.data);
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
