import React from "react";

interface Props {
  id: string;
}

const CodeBlock: React.FC<Props> = ({ id }) => {
  const getJson = () => {
    const lineDiv = document.querySelector(`div[data-rbd-draggable-id="${id}"]`);
    const questionContentDiv = lineDiv?.querySelector(".question-content");
    // for each of the child in questionContentDiv
    // get the textContent of each of child
    // check if each child contains the input selector
    // const inputDiv = questionContentDiv?.querySelector("input");
    // 
    return {
    //   operator: operatorDiv?.textContent,
    //   number: numberDiv?.textContent,
    //   userDefinedVariable: userDefinedVariableDiv?.textContent,
    //   keyword: keywordDiv?.textContent,
    //   inputValue: inputDiv?.value,
    };
  };

  const json = getJson();

  return <pre>{JSON.stringify(json, null, 2)}</pre>;
};

export default CodeBlock;
