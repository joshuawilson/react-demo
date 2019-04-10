import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import './App.css';
import Controller from './Controller';
// import * as d3 from 'd3';
// import axios from 'axios';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Topology POC</h1>
        </header>
        <Controller />
      </div>
    );
  }
}

export default App;
