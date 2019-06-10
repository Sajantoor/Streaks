import React from 'react';
import './App.css';

class Streak extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
      name: 'Read Everyday',
      description: 'Trying to read 30 minutes a day',
      achieved: 2,
      goal: 3,
      notifications: {
        1: '',
      },

      repeat: 'Daily',
      completed: false,
      lastCompleted: ''
    };
  };

  handleClick() {
     if (this.state.completed === false) {
        this.setState({completed: true});
        let achievedVal = this.state.achieved;
        this.setState({achieved: achievedVal + 1})
        this.refs.NotComplete.className = "Complete";
     }
  }

  calcPercentage() {
    let achievedVal = this.state.achieved;
    let goalVal = this.state.goal;
    let percentage = (achievedVal / goalVal) * 100;
    percentage = parseInt(percentage);
    return percentage;
  }

  render() {
     return (
       <div className="Streak">
          <h1>{this.state.name}</h1>
          <h2>{this.state.achieved}</h2>
          <button ref="NotComplete" className="NotComplete" onClick={() => this.handleClick()}>
            {this.state.completed ? "Streaked" : "Streak"}
          </button>
          <div className="progress-bar">
            <div className="filler"  style={{width: `${this.calcPercentage()}%`}}/>
              <p> {this.calcPercentage()}% Complete </p>
          </div>
       </div>
     );
  }
}




function App() {
  return (
    <div className="App">
      <Streak/>
    </div>
  );
}


export default App;
