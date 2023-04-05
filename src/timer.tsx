import { useState, useEffect } from 'react';

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
  console.log("Finished under" + currTime);
}


export {
  Timer,
  getFinishedTime
}