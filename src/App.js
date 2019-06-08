import React from 'react';
import './App.css';

class Streak extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
      Name: 'Read Everyday',
      Description: 'Trying to read 30 minutes a day',
      Achieved: 30,
      Goal: 100,
      Notifications: {
        1: '',
      },

      repeat: 'Daily',
      completed: false,
      lastCompleted: ''
    };
  };


render() {
   return (
     <div className="Streak">
        <h1>{this.state.Name}</h1>
        <h2>{this.state.Achieved}</h2>
        <button>
          Streak
        </button>
     </div>
   );
  }
}


function App() {
  return (
    <div className="App">
      <Streak></Streak>
    </div>
  );
}

export default App;
