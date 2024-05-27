import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AddEmployee } from './components/AddEmployee';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AddEmployee/>
      </header>
    </div>
  );
}

export default App;
