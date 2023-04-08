import { builtInFunctions, keywords, operators } from "./utils";

function code2Solution(code:string){
    const lines = code.split('\n');

    const codeObject = {
        lines: [] as { indentations: number, solution: string }[]
    };

    for (let line of lines) {
        const indentations = line.search(/\S/)/4;
        if(Number.isInteger(indentations)){
            line = line.trim();
            const lineObject = { indentations, solution: line };
            codeObject.lines.push(lineObject);
        }
    }

    return codeObject
}

type Props = {
    code: CodeBlock[];
    amount: number;
  };


function assignInput(code:{}, amount:number){
    const randomizedCode = JSON.parse(JSON.stringify(code));

    const nonOperatorTokens: Token[] = [];

    randomizedCode.forEach((block:any) => {
        block.tokens.forEach((token:Token) => {
        if (token.type !== 'operator') {
            nonOperatorTokens.push(token);
        }
        });
    });

    const selectedTokens = new Set<Token>();
    while (selectedTokens.size < amount && nonOperatorTokens.length > 0) {
        const index = Math.floor(Math.random() * nonOperatorTokens.length);
        const selectedToken = nonOperatorTokens[index];
        selectedToken.text = '{input}';
        selectedToken.type = undefined;
        selectedTokens.add(selectedToken);
        nonOperatorTokens.splice(index, 1);
    }

    return randomizedCode;
}

function code2Question(code:string, amount: number){
    const codeObject = transformCodeBlocks(code2Json(code));
    //random assign input 
    let questionObject = assignInput(codeObject, amount);
    return {lines: questionObject}
}


type Token = {
  text: string;
  type?: string;
};

type Line = {
  indentation: number;
  tokens: Token[];
};

const code2Json = (codeString: string): Line[] => {
  const lines: Line[] = [];

  for (const line of codeString.split("\n")) {
    if (line.trim() === "") {
      continue;
    }

    let indentation = 0;
    while (line[indentation] === " ") {
      indentation++;
    }
    indentation = indentation/4;

    const tokens: Token[] = [];
    let tokenText = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === "'" || char === '"') {
        inQuotes = !inQuotes;
        tokenText += char;
      } else if (char === " " && !inQuotes) {
        if (tokenText.trim() !== "") {
          tokens.push({
            text: tokenText.trim(),
            type: "unknown"
          });
        }
        tokenText = "";
      } else if (operators.includes(char) && !inQuotes) {
        if (tokenText.trim() !== "") {
          tokens.push({
            text: tokenText.trim(),
            type: "unknown"
          });
        }
        tokens.push({
          text: char,
          type: "operator"
        });
        tokenText = "";
      } else {
        tokenText += char;
      }
    }
    if (tokenText.trim() !== "") {
      tokens.push({
        text: tokenText.trim(),
        type: "unknown"
      });
    }
    lines.push({
      indentation,
      tokens
    });
  }

  return lines;
};


type CodeBlock = {
  indentation: number;
  tokens: Token[];
};

type CodeBlocks = CodeBlock[];


const transformCodeBlocks = (codeBlocks: CodeBlocks) => {
    const transformedCodeBlocks = codeBlocks.map((block) => {
      const transformedTokens = block.tokens.map((token) => {
        // console.log(token)
        if (builtInFunctions.includes(token.text)){
            return {
                text: token.text,
                type: "built-in-function",
            };
        }else if(keywords.includes(token.text)){
            return {
                text: token.text,
                type: "keyword",
            };
        }else if (token.text.startsWith("'") && token.text.endsWith("'")) {
            return {
                text: "{input}",
                type: undefined,
            };
        }else if (token.type == "unknown"){
            return {
                text: token.text,
                type: "user-defined-variable",
            };
        }
        return {
            text: token.text,
            type: token.type,
        };
      });
      return {
        indentation: block.indentation,
        tokens: transformedTokens,
      };
    });
    return transformedCodeBlocks;
};



export {
    code2Question,
    code2Solution
}