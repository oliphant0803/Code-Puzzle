import ReactDOM from "react-dom";
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import data from './data/tutorial.json';
import solution from './data/solution.json'
import {Move_Line} from './move-block';


const root = document.getElementById('root') as HTMLElement


ReactDOM.render(<Move_Line  question={data} solution={solution}/>, root);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
