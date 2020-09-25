import React from 'react';
import './App.css';
import News from './components/News';

 const App = () => {
  return (
    <div className="App">
      <header>
        <h1>Top Ten Bonner News</h1>
        <News />
      </header>
    </div>
  );
}

export default App;
