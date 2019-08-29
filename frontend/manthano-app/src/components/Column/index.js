import React from 'react';
import DndData from '../DndData';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd';

const Container = styled.div`
  margin: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  width: 33%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  padding: 10px;
`;

const DataList = styled.div`
  padding: 10px;
  flex-grow: 1;
  min-height: 100px;
`;

/**
 * Column Component for the Data DragNDrop Component
 */
export default class Column extends React.Component {
  render() {
    return (
      <Container>
        <Title>{this.props.column.title}</Title>
          <Droppable droppableId={this.props.column.id}>
            {(provided) => (
              <DataList
                {...provided.droppableProps}
                ref={provided.innerRef}
                >
                {this.props.data.map((data, index) => (
                  <DndData key={data.id} data={data} index={index} />
                ))}
                {provided.placeholder}
              </DataList>
            )}
          </Droppable>
      </Container>
    );
  }
}
