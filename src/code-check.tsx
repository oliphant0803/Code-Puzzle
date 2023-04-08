interface Div {
  id: string;
}

interface Line {
  indentations: number;
  solution: String;
}

interface Props {
  json: {
    lines: Line[];
  };
}

function getCodeBlock(id: Div["id"]) {
  const getJson = () => {
    const lineDiv = document.querySelector(`div[data-rbd-draggable-id="${id}"]`);
    const questionContentDiv = lineDiv?.querySelector(".question-content");
    // for each of the child in questionContentDiv
    // get the textContent of each of child
    // check if each child contains the input selector
    // const inputDiv = questionContentDiv?.querySelector("input");
    // 
    const textContentDivs = questionContentDiv? Array.from(questionContentDiv.children) : [];
    let currContent: string[] = [];
    textContentDivs.forEach((child)=>{
      const inputDiv = child.querySelector("input");
      if(inputDiv){//then also check the two spans
        //find the parent span of inputDiv
        const secondSpan = inputDiv.parentElement
        //first span
        const firstContent = secondSpan?.previousElementSibling?.textContent;
        //second span
        currContent.push(firstContent+inputDiv.value.toString()+secondSpan?.textContent);
      }else{
        currContent.push(child.textContent? child.textContent.toString():'');
      } 
    });
    return currContent
  };

  const jsonList = getJson();
  //is indent
  const indentList = jsonList.filter(blank=>blank == ' ');
  //is not indent
  let jsonStr = jsonList.filter(blank=>blank != ' ').join(' ');
  jsonStr=indentList.join('')+jsonStr;
  return jsonStr;
};

function checkLine(){
  const lineDiv = document.querySelector(`div[data-rbd-droppable-id="droppable"]`);
  const lines = lineDiv? Array.from(lineDiv.children) : [];
  let ids:String[] = [];
  lines.forEach((child)=>{
    ids.push(child.getAttribute("data-rbd-draggable-id")!);
  });
  let numIds:Number[] = [];
  ids.forEach(function(part, index){
    numIds[index] = Number(part.slice(5));
  }, ids);
  return (numIds.every(function(x, index){
    return index === 0 || x >= numIds[index-1];
  }));
}

function checkCode(json: Props["json"]){
  //get the number of lines in json
  //loop through line-"0" to "line num"
  //for each of the lines, get the getCodeBlock content 
  //compare and isolate the identation
  //and compare with json's line.content
  //if (a != null && b != null && a.replace(" ", "").toLowerCase().contains(b.replace(" ", "").toLowerCase()))
  var lines = json.lines;
  var correct = true;
  lines.map((line: Line, lineNum: number) => {
    let answer = getCodeBlock('line-'+lineNum);
    //get the number of whitespace before answer
    const indent = answer.search(/\S/);
    answer = answer.slice(indent);
    if (line.indentations != indent){
      //console.log("step 1 failed", answer, indent);
      correct = false;
      return false;
    }
    //compare with line.content
    //1st: replace multiple white space to one whitespace and double quote to single quote
    answer = answer.replace(/\s\s+/g, ' ');
    answer = answer.replace(/"/g, "'");
    //2nd: replace the one whitespace between operators to none
    answer = answer.replace(/\s*[=()+'':\-/*%]\s*/g, ((match)=> {
      return match.trim();
    }));
    let result = line.solution   
    result = result.replace(/\s\s+/g, ' ');
    result = result.replace(/\s*[=()+'':\-/*%]\s*/g, ((match)=> {
      return match.trim();
    }));
    if (result != answer){
      console.log("step 2 failed", answer, result);
      correct = false;
      return false;
    }
    console.log(answer, result);
  });
  return correct;
}

export {
  checkCode,
  checkLine
};
