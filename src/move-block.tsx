import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Question , increment, decrement, lineItems, getItems, domLineItems, indentations } from './read-json';
import data from "./data/test-fixed.json";
import { InputBox } from './input-box';
import { Timer, getFinishedTime } from './timer';
import { checkCode, checkLine } from './code-check';
import solution from './data/solution.json';
import { shuffle } from './utils';
import { isV8IntrinsicIdentifier } from '@babel/types';


function handleInputChange() {
  if(checkLine() && checkCode(solution)){
    getFinishedTime();
  }
}

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
  borderRadius: '25px',
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
  }
);


class Move_Block extends Component<{ lineNum: number }, AppState> {
  firstDrag: boolean;
  currItems: Item[];
  constructor(props: {lineNum:number}) {
    super(props);
    this.state = {
      items: lineItems[props.lineNum],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.currItems = lineItems[props.lineNum];
    this.firstDrag = true;
  }
  onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    this.firstDrag = false;
    this.currItems = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items: this.currItems,
    }, () => {
      if(checkLine() && checkCode(solution)){
        getFinishedTime();
      }
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
              {this.currItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={domLineItems[this.props.lineNum].find(i => i.id === 'dom-'+item.id)!.class=='indent'}>
                  {(provided, snapshot) => (
                    (domLineItems[this.props.lineNum].find(i => i.id === 'dom-'+item.id)!.class!='input') ?
                    (<div
                      className={domLineItems[this.props.lineNum].find(i => i.id === 'dom-'+item.id)!.class}
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
        <>        
          <button onClick={() => {
            increment(this.props.lineNum);
            if(!this.firstDrag){
              this.currItems.unshift({
                id: 'line-'+this.props.lineNum+'-indent-'+indentations[this.props.lineNum],
                content: ` `
              })
              console.log(this.currItems, lineItems[this.props.lineNum]);
            }
            this.setState({
              items: this.currItems,
            }, () => {
              if(checkLine() && checkCode(solution)){
                getFinishedTime();
              }
            });
          }} className='add-indent'>&gt;</button>
          <button onClick={() => {
            if (decrement(this.props.lineNum)){
              if(!this.firstDrag){this.currItems.shift();}
              console.log(this.currItems, lineItems[this.props.lineNum]);
              this.setState({
                items: this.currItems,
              }, () => {
                if(checkLine() && checkCode(solution)){
                  getFinishedTime();
                }
              });
            }
            
          }} className='rm-indent'>&lt;</button>
        </>
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
      items,
    }, () => {
      if(checkLine() && checkCode(solution)){
        getFinishedTime();
      }
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Question json={data}/>
        <Timer />
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
      {/* <CodeBlock id={'line-3'} /> */}
      </DragDropContext>
    );
  }
}

export {
  Move_Block,
  Move_Line,
}
