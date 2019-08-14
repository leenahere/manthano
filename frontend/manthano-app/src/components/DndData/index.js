import React from 'react';
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: whitesmoke;
`;

export default class DndData extends React.Component {
  render() {
    return (
      <Draggable
        draggableId={this.props.data.id}
        index={this.props.index}
      >
        {provided => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {this.props.data.name}
          </Container>
        )}
      </Draggable>
    );
  }
}
