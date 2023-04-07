import React, { Component, createRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable, DropResult, DragUpdate } from 'react-beautiful-dnd';
import { Question , increment, decrement, lineItems, getItems, domLineItems, indentations, firstDragCheck } from './read-json';
import data from "./data/test-fixed.json";
import { InputBox } from './input-box';
import { Timer, getFinishedTime } from './timer';
import { checkCode, checkLine } from './code-check';
import solution from './data/solution.json';
import { shuffle } from './utils';


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
  dragUpdate: DragUpdate | null;
}

interface LineState {
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


let currItems:Item[][]= Array.from({length: data.lines.length}, (_, i) => lineItems[i]);


class Move_Block extends Component<{ lineNum: number }, LineState> {
  constructor(props: {lineNum:number}) {
    super(props);
    this.state = {
      items: lineItems[props.lineNum],
    };
    this.onDragEnd = this.onDragEnd.bind(this);

  }
  onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    firstDragCheck[this.props.lineNum] = false;
    currItems[this.props.lineNum] = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items: currItems[this.props.lineNum],
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
              {currItems[this.props.lineNum].map((item, index) => (
                (domLineItems[this.props.lineNum].find(i => i.id === 'dom-'+item.id)!.class=='indent')?
                <div key={item.id} className={'indent'}>
                  {item.content}
                </div>:
                <Draggable key={item.id} draggableId={item.id} index={index} >
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
        {/* <>        
          <button onClick={() => {
            increment(this.props.lineNum);
            if(!this.firstDrag){
              this.currItems.unshift({
                id: 'line-'+this.props.lineNum+'-indent-'+indentations[this.props.lineNum],
                content: ` `
              })
              //console.log(this.currItems, lineItems[this.props.lineNum]);
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
              //console.log(this.currItems, lineItems[this.props.lineNum]);
              this.setState({
                items: this.currItems,
              }, () => {
                if(checkLine() && checkCode(solution)){
                  getFinishedTime();
                }
              });
            }
            
          }} className='rm-indent'>&lt;</button>
        </> */}
      </DragDropContext>
    );
  }
}

class Move_Line extends Component<{}, AppState> {
  moveBlockRef: React.RefObject<Move_Block>;
  onStop: boolean;
  constructor(props: {}) {
    super(props);
    this.moveBlockRef = createRef();
    this.state = {
      items: shuffle(getItems(data)),
      dragUpdate: null,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragUpdate = this.onDragUpdate.bind(this);
    this.onStop = true;
  }

  addIndent = (lineNum:number) => {
    if (this.moveBlockRef.current && increment(lineNum)) {
      console.log(firstDragCheck);
      if(!firstDragCheck[lineNum]){
        currItems[lineNum].unshift({
          id: 'line-'+lineNum+'-indent-'+indentations[lineNum],
          content: ` `
        })
      }
    }
  }

  removeIndent = (lineNum:number) => {
    if (this.moveBlockRef.current) {
      if (decrement(lineNum)){
        if(!firstDragCheck[lineNum]){
          currItems[lineNum].shift();
        }
      }
    }
  }

  onDragEnd(result: DropResult) {
    // dropped outside the list
    this.onStop = true;
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

  onDragUpdate(update: DragUpdate) {
    this.setState({
      dragUpdate: update,
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
                  {(provided, snapshot) => {
                    if(provided.draggableProps.style && provided.draggableProps.style.transform){
                      const { x, y } = provided.draggableProps.style.transform.match(/translate\((?<x>[-\d.]+)px, (?<y>[-\d.]+)px\)/)?.groups ?? { x: 0, y: 0 };
                      if(parseFloat(x.toString()) >= 30 && this.onStop){
                          //Add indent
                          this.addIndent(Number(item.id.substring(5)));
                          this.onStop = false;
                      }else if(parseFloat(x.toString()) <= -30 && this.onStop){
                          //remove indent
                          this.removeIndent(Number(item.id.substring(5)));
                          this.onStop = false;
                      }
                    }
                    return (<div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        false
                      )}
                    >
                      <Move_Block ref={this.moveBlockRef} lineNum={Number(item.id.substring(5))}/>
                      {item.content}
                    </div>
                  );
                }}
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
