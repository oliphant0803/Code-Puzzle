import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from "react-bootstrap";
import ReactDOM from 'react-dom';
import { Move_Line } from './move-block';

interface PopupProps {
  title: string;
  message: string;
}


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
      //a new game
      const root = document.getElementById('root') as HTMLElement
      ReactDOM.render(<Move_Line/>, root)
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
              Restart
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
};


export {
  Timer,
  getFinishedTime,
  Popup
}