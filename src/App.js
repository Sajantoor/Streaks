import React from 'react';
import './App.css';
import { ReactComponent as AddIcon } from './Assets/add.svg';
import { ReactComponent as CloseIcon } from './Assets/close.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

let items = [
  {
    'name': 'Read books',
    'description': 'Boi this is a description',
    'achieved': 10,
    'goal': 15,
    'completed': false,
  },
  {
    'name': 'Go to the gym',
    'description': 'Wow what a great description',
    'achieved': 69,
    'goal': 100,
    'completed': false,
  },
]

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
      completed: this.props.completed,
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

        <button className={
              this.state.completed ? "Complete" : "NotComplete"
            } onClick={() => this.handleClick()}>
             Streak <span role="img"  aria-label="Fire"> 🔥 </span>
          </button>

       </div>
     );
  }

  handleClick() {
    if (this.state.completed === false) {
        let currentTime = getDate();
        let achievedVal = this.state.achieved;
        let id = this.props.id;

        this.setState({completed: true});
        this.setState({achieved: achievedVal + 1});
        this.setState({lastCompleted: currentTime});

        // Puts data into items JSON
        items[id].achieved = achievedVal + 1;
        items[id].completed = true;
        items[id].lastCompleted = currentTime;
        console.log(items[id]);
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
  render() {
    return (
        <Link to="/new">
          <button className="add">
            <AddIcon/>
          </button>
        </Link>
    )
  }
}

// Home page of the app
function Home() {
  return (
    <div>
      {items.map((items, index) =>
        <Item
          key={index}
          id={index}
          name={items.name}
          description={items.description}
          achieved={items.achieved}
          goal={items.goal}
          completed={items.completed}
        />
      )}
      <Add/>
    </div>
  );
}

class New extends React.Component {
  render() {
    return (
    <div className="new">
      <Link to="/">
        <button id="close">
          <CloseIcon/>
        </button>
      </Link>
      <button id="done" onClick={() => this.addItem()}> Done </button>

      <input id="title" ref="title" type="text" placeholder="Streak Title"></input>
      <textarea id="description" ref="description" placeholder="Enter your streak description!"></textarea>
      <div className="below">
        <select id="repeat" ref="repeat">
           <option value="Daily">Daily</option>
           <option value="Weekdays">Weekdays</option>
           <option value="Weekends">Weekends</option>
           <option value="Monday">Monday</option>
           <option value="Tuesday">Tuesday</option>
           <option value="Wednesday">Wednesday</option>
           <option value="Thursday">Thursday</option>
           <option value="Friday">Friday</option>
           <option value="Saturday">Saturday</option>
           <option value="Sunday">Sunday</option>
        </select>

        <h2> Repeat </h2>

        <input id="goal" ref="goal" type="number" placeholder="30 days"></input>
        <h2> Goal </h2>

      </div>

    </div>
    )
  }

  addItem() {
    let name = this.refs.title.value;
    let description = this.refs.description.value;
    let repeat = this.refs.repeat.value;
    let goal = this.refs.goal.value;

    // eslint-disable-next-line
    if ((name && description && repeat && goal) == false) {
      alert("Invalid submission: Check if all the fields are filled.")
      return;
    }

    if (goal < 0) {
      alert('Your goal must be greater than zero!');
      return;
    }

    let data = {
      "name": name,
      "description": description,
      "repeat": repeat,
      "goal": goal,
      "achieved": 0,
      "completed": false,
    }

    items.push(data);
    console.log(items);
    this.props.history.push('/')
  }
}

function Page404() {
  return(
    <div>
      <h1> 404, let's fix that! <span role="img" aria-label="Ok Hand"> 👌 </span> </h1>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/new" component={New}></Route>
        <Route component={Page404}/>
      </Switch>
      </div>
    </Router>
  );
}

function getDate() {
  let today = new Date();
  let date = today.getFullYear()+ '-' +(today.getMonth()+1) + '-' + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date +' '+ time;
  return dateTime;
}

export default App;

// Needs a data base!
// notifications + suprise streak element
// settings page
// reset streak timer
// expand streak to see al lthe components and to edit.
// edit on the new page but with the data passed via props.
// CSS issues with percentage bar at low percentages about 1 - 2%
