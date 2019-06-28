import React from 'react';
import './App.css';
import { ReactComponent as Logo } from './Assets/add.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Item extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
      name: this.props.name,
      description: this.props.description,
      achieved: this.props.achieved,
      goal: this.props.goal,
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
       <div className="Item">
          <h1>{this.state.name}</h1>
          <h2>
            {this.state.achieved === 100 ?
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
        this.setState({achieved: achievedVal + 1});
        this.setState({lastCompleted: getDate()});
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
        <Link to="/new">
          <button className="add">
            <Logo/>
          </button>
        </Link>
    )
  }
}

function getDate() {
  var today = new Date();
  var date = today.getFullYear()+ '-' +(today.getMonth()+1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date +' '+ time;
  return dateTime;
}

var items = [
  {
    'name': 'Read books',
    'description': 'Boi this is a description',
    'achieved': 10,
    'goal': 15,
  },
  {
    'name': 'Go to the gym',
    'description': 'Wow what a great description',
    'achieved': 69,
    'goal': 100,
  },
]

// Home page of the app
function Home() {
  return (
    <div>
      {items.map(items =>
        <Item
          name={items.name}
          description={items.description}
          achieved={items.achieved}
          goal={items.goal}
        />
      )}
      <Add/>
    </div>
  );
}

// function New() {
//   return(
//
//   )
// }

function App() {
  return (
    <Router>
      <div className="App">
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/new"></Route>
      </Switch>
      </div>
    </Router>
  );
}

export default App;

// BUG: Relative units and smaller text sizes
// Tested on mobile and the text sizes are too big
// ... text cut off when text is too long and overflows
