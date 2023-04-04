import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Question, { getDomItems } from './read-json';
import data from "./data/test-fixed.json";
import { getItems, getLineItems } from './read-json';
import InputBox from './input-box';


function handleInputChange(value: string) {
  console.log(value);
}

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;


interface Item {
  id: string;
  content: string;
}

interface AppState {
  items: Item[];
}

const getItemStyle = (isDragging: boolean, draggableStyle: any, isLine: boolean) => (
  isLine ? {
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgrey' : 'white',
  border: 'solid',

  // styles we need to apply on draggables
  ...draggableStyle,
  } : {
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgrey" : "white",

    // styles we need to apply on draggables
    ...draggableStyle
  }
);

const getListStyle = (isDraggingOver: boolean, isLine:boolean) => (
  isLine ? {
    background: isDraggingOver ? 'lightgrey' : 'white',
    display: 'flex',
    padding: grid,
    overflow: 'none',
  } : {
    background: isDraggingOver ? 'lightgrey' : 'white',
    padding: grid,
    width: 'fit-content'
  }
);

class Move_Block extends Component<{ lineNum: number }, AppState> {
  constructor(props: {lineNum:number}) {
    super(props);
    this.state = {
      items: shuffle(getLineItems(data, props.lineNum)),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className='question-content'
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, true)}
              {...provided.droppableProps}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    (getDomItems(data, this.props.lineNum).find(i => i.id === 'dom-'+item.id)!.class!='input') ?
                    (<div
                      className={getDomItems(data, this.props.lineNum).find(i => i.id === 'dom-'+item.id)!.class}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        true
                      )}
                    >
                      {item.content}
                    </div>) : (
                      <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        true
                      )}
                    >
                      <InputBox label={item.content} onChange={handleInputChange}/>
                      
                    </div>)
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

class Move_Line extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      items: shuffle(getItems(data))
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Question json={data}/>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, false)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        false
                      )}
                    >
                      <Move_Block lineNum={Number(item.id.substring(5))}/>
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export {
  Move_Block,
  Move_Line,
}
