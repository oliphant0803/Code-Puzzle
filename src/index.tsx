import ReactDOM from "react-dom";
import './index.css';
import Test from './code-gen';
import reportWebVitals from './reportWebVitals';
import {Move_Block, Move_Line} from './move-block';


const root = document.getElementById('root') as HTMLElement


ReactDOM.render(<Move_Line/>, root);
//ReactDOM.render(<Test />, root);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
