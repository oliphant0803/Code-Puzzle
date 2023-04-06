import { updateExpression } from '@babel/types';
import React from 'react';
import data from './data/test-fixed.json';
import { shuffle } from './utils';
import { Move_Block, Move_Line } from './move-block';

interface Token {
  text: string;
  type?: string;
}

interface ItemDom {
    id: string;
    class: string;
}

interface Item {
    id: string;
    content: string;
}

interface Line {
  indentations: number;
  tokens: Token[];
}

interface Props {
  json: {
    lines: Line[];
  };
}

let indentations:number[] = Array(data.lines.length).fill(0);
let lineItems:[Item[]] = [[]];
let domLineItems:[ItemDom[]] = [[]];
let firstDragCheck:boolean[] = Array(data.lines.length).fill(true);

function increment(lineNum:number) {
  indentations[lineNum] += 1;
  console.log("add", indentations);
  addItems(lineNum);
  return true
}

function decrement(lineNum:number) {
  if(indentations[lineNum] > 0){
    indentations[lineNum] -= 1;
    console.log("rm", indentations);
    if(domLineItems[lineNum][0].class == 'indent'){
      lineItems[lineNum].shift();
      domLineItems[lineNum].shift();
      return true
    }
  }
  return false
}

function initItems(){
  data.lines.map((line: Line, lineNum: number) => (
    getLineItems(data, lineNum) &&
    getDomItems(data, lineNum)
  ));
}

function addItems(lineNum:number){
  //get the number of identation for the line items
  //update getlineDom 
  lineItems[lineNum].unshift({
      id: 'line-'+lineNum+'-indent-'+indentations[lineNum],
      content: ` `
  })
  
  domLineItems[lineNum].unshift({
    id: 'dom-line-'+lineNum+'-indent-'+indentations[lineNum],
    class: 'indent'
  })
}

// get the items of each line from json questions
export function getLineItems(json:any, num: number){
    var items: Item[] = [];
    var lines = json.lines;
    lines.map((line: Line, lineNum: number) => (
        (num == lineNum) &&
        // Array.from({ length: indentations[num] }, (v, k) => k).map(k => (
        //     items.push({
        //         id: 'line-'+lineNum+'-place-'+k,
        //         content: ` `
        //     })
        // )) && 
        line.tokens.map((token: Token , index: number) => (
            items.push({
                id: 'line-'+lineNum+'-place-'+(index),
                content: token.text
            })
        ))
    ))
    lineItems[num] = shuffle(items);
    return items;
};

export function getDomItems(json:any, num: number){
    var itemsDom: ItemDom[] = [];
    var lines = json.lines;
    lines.map((line: Line, lineNum: number) => (
        (num == lineNum) &&
        // Array.from({ length: indentations[num] }, (v, k) => k).map(k => (
        //     itemsDom.push({
        //       id: 'dom-line-'+lineNum+'-place-'+k,
        //       class: 'indent'
        //     })
        // )) && 
        line.tokens.map((token: Token , index: number) => (
            itemsDom.push({
              id: 'dom-line-'+lineNum+'-place-'+(index),
              class: (token.type && !token.text.includes('{input}')) ? token.type : 'input'
            })
        ))
    ))
    domLineItems[num] = itemsDom;
    return itemsDom
}

// get the number of line (as a whole) from json questions
export function getItems(json:any){
    var lineItems: Item[] = [];
    var lines = json.lines;
    lines.map((line: Line, lineNum: number) => (
        lineItems.push({
            id: 'line-'+lineNum,
            content: ''
        })
    ));
    return lineItems
};

// display the answer of the question for developers to see, will comment out
const Question: React.FC<Props> = ({ json }) => {
  return (
    <div>
      {json.lines.map((line, index) => (
        <div key={index}>
          <span style={{ marginLeft: `${line.indentations * 20}px` }}>
            {line.tokens.map((token, index) => (
              <span key={index} className={token.type}>
                {token.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
};

initItems();

export {
  Question,
  increment,
  decrement,
  lineItems,
  domLineItems,
  indentations,
  firstDragCheck
};