import React, { Component } from 'react';
import './App.css';
import Controller from './graph/components/Controller';



class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Topology POC</h1>
        </header>
        <main className={'app-content'}>
          <Controller />
        </main>
        <footer className="App-footer">
          <h3 className="App-footer-text">This is a footer</h3>
        </footer>
      </div>
    );
  }
}

export default App;
