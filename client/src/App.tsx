import React from 'react';
import './App.css';
import Attendance from './components/userAttendence.tsx';
import VerifyUser from './components/verifyUser.tsx';

function App() {
  return (
    <div className="App">
      <Attendance/>
      {/* <VerifyUser></VerifyUser> */}
      {/* <header className="App-header">
        <img src="" className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
