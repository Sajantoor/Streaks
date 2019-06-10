import React from 'react';
import './App.css';

class Streak extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
      name: 'Read Everyday',
      description: 'Trying to read 30 minutes a day',
      achieved: 29,
      goal: 69,
      notifications: {
        1: '',
      },

      repeat: 'Daily',
      completed: false,
      lastCompleted: false,
    };
  };

  handleClick() {
     if (this.state.completed === false) {
        this.setState({completed: true});
        let achievedVal = this.state.achieved;
        this.setState({achieved: achievedVal + 1})
        this.setState({lastCompleted: getDate()})
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
          <h2>{this.state.achieved} <span role="img"  aria-label="Fire"> 🔥 </span> </h2>
          <div className="progress-bar">
            <div className="filler"  style={{width: `${this.calcPercentage()}%`}}></div>
          </div>
          <h3> {this.calcPercentage()}% Complete </h3>
          <button ref="NotComplete" className="NotComplete" onClick={() => this.handleClick()}>
             Streak <span role="img"  aria-label="Fire"> 🔥 </span>
          </button>
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

function getDate() {
  var today = new Date();
  var date = today.getFullYear()+ '-' +(today.getMonth()+1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date +' '+ time;
  return dateTime;
}

getDate();

export default App;
