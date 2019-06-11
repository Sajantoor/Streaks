import React from 'react';
import './App.css';
import { ReactComponent as Logo } from './Assets/add.svg';

class Streak extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
      name: this.props.name,
      description: 'Trying to read 30 minutes a day',
      achieved: 99,
      goal: 120,
      notifications: {
        1: '',
      },

      repeat: null,
      completed: false,
      lastCompleted: null,
    };
  };

  render() {
     return (
       <div className="Streak">
          <h1>{this.state.name}</h1>

          <h2>
            {this.state.achieved == 100 ?
              <span role="img"  aria-label="Hundred Points"> 💯 </span>
              :
                this.state.achieved
              }
            <span role="img"  aria-label="Fire"> 🔥 </span>
          </h2>

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
}

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  };

  render() {
    return (
      <button class="add">
        <Logo/>
      </button>
    )
  }
}

function App() {
  return (
    <div className="App">
      <Streak name="Elon "/>
      <Streak name="Musk boi"/>
      <Add/>
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

export default App;

// BUG: Relative units and smaller text sizes
// Tested on mobile and the text sizes are too big
// ... text cut off when text is too long and overflows
