import React from 'react';

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

// get the items of each line from json questions
export function getLineItems(json:any, num: number){
    var items: Item[] = [];
    var lines = json.lines;
    lines.map((line: Line, lineNum: number) => (
        (num == lineNum) &&
        Array.from({ length: line.indentations }, (v, k) => k).map(k => (
            items.push({
                id: 'line-'+lineNum+'-place-'+k,
                content: ` `
            })
        )) && 
        line.tokens.map((token: Token , index: number) => (
            items.push({
                id: 'line-'+lineNum+'-place-'+(index+line.indentations),
                content: (token.text.includes('{input}')) ? token.text.replace('{input}', '') : token.text
            })
        ))
    ))
    return items
};

export function getDomItems(json:any, num: number){
    var itemsDom: ItemDom[] = [];
    var lines = json.lines;
    lines.map((line: Line, lineNum: number) => (
        (num == lineNum) &&
        Array.from({ length: line.indentations }, (v, k) => k).map(k => (
            itemsDom.push({
              id: 'dom-line-'+lineNum+'-place-'+k,
              class: 'indent'
            })
        )) && 
        line.tokens.map((token: Token , index: number) => (
            itemsDom.push({
              id: 'dom-line-'+lineNum+'-place-'+(index+line.indentations),
              class: (token.type && !token.text.includes('{input}')) ? token.type : 'input'
            })
        ))
    ))
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

export default Question;