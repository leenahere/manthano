import React from 'react';
import DndData from '../DndData';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd';
import { withTranslation, Translation  } from 'react-i18next';

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
class Column extends React.Component {
  render() {
    let { t } = this.props;
    let title;
    if (this.props.column.title == "Features") {
      title = <Title>{t("dnd.features")}</Title>;
    } else if (this.props.column.title == "Labels") {
      title = <Title>{t("dnd.labels")}</Title>;
    } else if (this.props.column.title == "Data") {
      title = <Title>{t("dnd.data")}</Title>;
    }
    return (
      <Container>
        { title }
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

export default withTranslation(['translations'])(Column);
