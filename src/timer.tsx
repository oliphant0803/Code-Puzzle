import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from "react-bootstrap";
import ReactDOM from 'react-dom';
import { Move_Line } from './move-block';
import test from './code-gen';
import { code2Question, code2Solution } from './question-gen';

interface PopupProps {
  title: string;
  message: string;
}

let aiQuestion = {};
let aiSolution = {};
let currTime = 0;

function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  currTime = time;

  return (
    <div id='timer'>
      <h2>Time Spend: {time} seconds</h2>
    </div>
  );
}

function getNewQuestion() {
  document.getElementById('timer')!.style.visibility="hidden";
  const root = document.getElementById('root') as HTMLElement;
  const endMessage = "Skipped"
  ReactDOM.render(<Popup title={'Game Ends'} message={endMessage}/>, root)
}

function Skip() {
  return (
    <button onClick={getNewQuestion} className="btn btn-primary skipped">Skip</button>
  );
}

function getFinishedTime(){
  document.getElementById('timer')!.style.visibility="hidden";
  //console.log("Finished under" + currTime);
  const root = document.getElementById('root') as HTMLElement
  const endMessage = "Congraduations! You finished the task under " + currTime.toString() + " seconds";
  ReactDOM.render(<Popup title={'Game Ends'} message={endMessage}/>, root)
}


const Popup: React.FC<PopupProps> = ({ title, message }) => {
    const [show, setShow] = useState(true);
  
    const handleClose = () => {
      setShow(false);
      //a new window
      window.location.reload();
    }

    const newQuestion = async () => {
      setShow(false);
      //a new question
      //window.location.reload();
      //generate code for a openAI question
      const code = await test();
      // const code  = `
      // password = ""
      // while password != "123":
      //     password = input("Please enter the password: ")
      //     if password == "123":
      //         print("Password is correct.")
      //     else:
      //         print("Password is incorrect. Please re-enter the password.")
      
      // print("Password is correct.")`;
      aiSolution = code2Solution(code!);
      aiQuestion = code2Question(code!, 5); //5 = number of random input blocks
      //console.log(aiSolution, aiQuestion);
      //render new question
      if(Object.keys(aiQuestion).length > 0 && Object.keys(aiSolution).length > 0){
        const root = document.getElementById('root') as HTMLElement;
        return ReactDOM.render(<Move_Line  question={aiQuestion} solution={aiSolution}/>, root);
      }else{
        alert("no more questions");
      }
    }

    return (
      <>
        <Modal show={show} onHide={handleClose} centered size="lg" className="pop-up">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} style={{ width: '150px', margin: "0 auto" }}>
              Start Over
            </Button>
            <Button variant="primary" onClick={newQuestion} style={{ width: '150px', margin: "0 auto" }}>
              Next Question
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
};


export {
  Timer,
  getFinishedTime,
  Popup,
  Skip
}