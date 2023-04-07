import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import React, { useEffect, useState } from 'react';

const configuration = new Configuration({
  // TODO: place this api-key into an .env file and do not commit the .env file to your repo
  // I will revoke this api-key after you are done with the task
  //apiKey: "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",
});

export const openai = new OpenAIApi(configuration);

// you probably don't want to change this
export const generateCode = async (description: string, context: string) => {
    // here we provide multiple [intended-behavior] and [code] snippets as examples to the GPT-3.5 model
    // this will help the model to generate output similar to the provided examples and pre-condition the output format
    if (description !== undefined) {
        const messages: Array<ChatCompletionRequestMessage> = [
            {
                role: "system",
                content:
                    "for each provided [intended-behavior] generate short python [code] snippets for the novice children that are learning programming for the first time.",
            },
            {
                role: "user",
                content: `[intended-behavior]: say hello world\n[code]:`,
            },
            {
                role: "assistant",
                content: `print("hello world")\n[end-code]`,
            },

            {
                role: "user",
                content: `[intended-behavior]: ask the user for their name\n[code]:`,
            },
            {
                role: "assistant",
                content: `name = input("What is your name? ")\n[end-code]`,
            },

            {
                role: "user",
                content: `[intended-behavior]: ask the user to enter a number\n[code]:`,
            },
            {
                role: "assistant",
                content: `number = int(input("Enter a number: "))\n[end-code]`,
            },

            {
                role: "user",
                content: `[intended-behavior]: generate a random number\n[code]:`,
            },
            {
                role: "assistant",
                content: `import random\nnumber = random.randint(0, 100)\n[end-code]`,
            },

            {
                role: "user",
                content: `[intended-behavior]: check if the number is greater than 50\n[code]:`,
            },
            {
                role: "assistant",
                content: `if number > 50:\n    print("The number is greater than 50")\n[end-code]`,
            },

            {
                role: "user",
                content: `[intended-behavior]: check if roll is even\n[code]:`,
            },
            {
                role: "assistant",
                content: `if roll % 2 == 0:\n    print("The roll is even")\n[end-code]`,
            },
        ];

        if (context && context.length > 0) {
            // when there is a context (code that has already been written), we provide it to the model as well
            messages.push({
                role: "user",
                content: `[context-code]:\n${context}\n[intended-behavior]: use the above [context-code] as context and ${description}\n[code]:`,
            });
        } else {
            messages.push({
                role: "user",
                content: `[intended-behavior]: ${description}\n[code]:`,
            });
        }

        const result = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0.1,
            max_tokens: 500,
            stop: ["[end-code]"],
        });

        if (result.data.choices && result.data.choices?.length > 0) {
            const code = result.data.choices[0].message?.content;

            return code;
        }

        return "";
    }
};

function Test() {
  const [code, setCode] = useState('');

  useEffect(() => {
    async function generate() {
      const code = await generateCode(
        "Write a program that uses a while loop to repeatedly ask the user to enter a password (as a number) and check if the password is equal to 123. If it is, display the message Password is correct. If it is not, display the message Password is incorrect and ask the user to re-enter the password. The program should stop when the user enters the number 123. Finally, after the user gets the correct password, display the message Password is correct.",
        ""
      );
      setCode(code!);
    }
    generate();
  }, []);

  return (
    <div>
      <h1>Generated Code:</h1>
      <pre>{code}</pre>
    </div>
  );
}

export default Test;
