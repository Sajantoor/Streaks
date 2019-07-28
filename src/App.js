import React from 'react';
import './App.css';
import { ReactComponent as AddIcon } from './Assets/add.svg';
import { ReactComponent as CloseIcon } from './Assets/close.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import localForage from 'localforage';
// initialize items as global
let items = [];

// Item storage JSON before data base, based for debugging and stuff
// let items = [
//   {
//     'name': 'Read books',
//     'description': 'Boi this is a description',
//     'achieved': 10,
//     'goal': 15,
//     'completed': false,
//     'repeat': 'Saturday',
//   },
//   {
//     'name': 'Go to the gym',
//     'description': 'Wow what a great description',
//     'achieved': 69,
//     'goal': 100,
//     'completed': false,
//     'repeat': 'Daily',
//   },
// ]

// localForage.setItem('items', items);

class App extends React.Component {
  state = {
    completed: false,
  }

  componentDidMount() {
    this._asyncRequest = localForage.getItem('items').then(
      data => {
        this._asyncRequest = null;
        items = data;
        this.setState({completed: true});
      }
    );
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.completed === false) {
      // replaced with loading screen
      return (
        <div> </div>
      );
    } else {
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
    }
  }

  // Fetch from local storage

//   render() {
//     return (
//       <Router>
//         <div className="App">
//         <Switch>
//           <Route path="/" exact component={Home}></Route>
//           <Route path="/new" component={New}></Route>
//           <Route component={Page404}/>
//         </Switch>
//         </div>
//       </Router>
//     );
//   }
// }
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
          repeat={items.repeat}
          completed={items.completed}
        />
      )}
      <Add/>
    </div>
  );
}

// Streak items class
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

      repeat: this.props.repeat,
      completed: this.props.completed,
      lastCompleted: null,
    };
  };

  render() {
     return (
       <div className="Item">
         <Link to={`/new?edit=${this.props.id}`}>
          <h1>{this.state.name}</h1>
          <h2>
            {this.state.achieved === 100 ?
              <span role="img"  aria-label="Hundred Points"> 💯 </span>
              :
                this.state.achieved
              }
            <span role="img"  aria-label="Fire"> 🔥 </span>
          </h2>
        </Link>

          <div className="progress-bar">
            <div className="filler"  style={{width: `${this.calcPercentage()}%`}}></div>
          </div>
          <h3> {this.calcPercentage()}% Complete </h3>

        <button className={
              this.state.completed ? "Complete" : "NotComplete"
            } onClick={() => this.streakComplete()}>
             Streak <span role="img"  aria-label="Fire"> 🔥 </span>
          </button>
       </div>
     );
  }
  // Check whether of not today is the day where the streak can be completed,
  // if not then streak is marked as completed until it's able to be completed.
  streakCheck() {
    let date = new Date();
    let item = this;
    let id = this.props.id;
    let repeat = items[id].repeat;
    let lastCompleted = items[id].lastCompleted;
    let today = date.getDay();
    let hours = date.getHours();
    let currentDate = date.getFullYear()+ '-' +(date.getMonth()+1) + '-' + date.getDate();

    if (lastCompleted === currentDate) return;

    function streaked() {
      items[id].completed = false;
      item.setState({completed: false});
      console.log(item.state);
      localForage.setItem('items', items);
      return;
    }

    if (repeat === 'Sunday') repeat = 0;
    if (repeat === 'Monday') repeat = 1;
    if (repeat === 'Tuesday') repeat = 2;
    if (repeat === 'Wednesday') repeat = 3;
    if (repeat === 'Thursday') repeat = 4;
    if (repeat === 'Friday') repeat = 5;
    if (repeat === 'Saturday') repeat = 6;

    if (repeat === today && hours > 8) streaked();

    else if (repeat === "Daily") {
      if (repeat && hours > 8) streaked();
    }

    else if (repeat === "Weekdays") {
      if ((today <= 1 && today <= 5) && hours > 8) streaked();
    }
    // BUG: Weekends check doesn't work idk why
    else if (repeat === "Weekends") {
      if ((today === 0|| today === 6) && hours > 8) streaked();
    }

    else {
      items[id].completed = true;
      item.setState({completed: true});
      localForage.setItem('items', items);
      return;
    }
  }

  // Handles the completion of the streak
  streakComplete() {
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
        localForage.setItem('items', items);
     }
  }
  // Calculates the percentage of the streak, completion vs goal
  calcPercentage() {
    let achievedVal = this.state.achieved;
    let goalVal = this.state.goal;
    let percentage = (achievedVal / goalVal) * 100;
    percentage = parseInt(percentage);
    return percentage;
  }

  // When the component is mounted then it runs streak check
  componentDidMount() {
    this.streakCheck();
  }
}

// Add item button
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

// New page or edit page for streaks
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
        <input id="goal" ref="goal" type="number" placeholder="30"></input>
        <h2> Goal </h2>

      </div>
    </div>
    )
  }

  componentDidMount() {
    if (window.location.search) {
      this.editItem();
    }
  }

  editItem() {
    let id = window.location.search.split('=')[1];
    this.refs.title.value = items[id].name;
    this.refs.description.value = items[id].description;
    this.refs.repeat.value = items[id].repeat;
    this.refs.goal.value = items[id].goal;
  }

  addItem() {
    const name = this.refs.title.value;
    const description = this.refs.description.value;
    const repeat = this.refs.repeat.value;
    const goal = this.refs.goal.value;

    // eslint-disable-next-line
    if ((name && description && repeat && goal) == false) {
      alert("Invalid submission: Check if all the fields are filled.")
      return;
    }

    if (goal < 0) {
      alert('Your goal must be greater than zero!');
      return;
    }

    const data = {
      "name": name,
      "description": description,
      "repeat": repeat,
      "goal": goal,
      "achieved": 0,
      "completed": false,
    }

    if (window.location.search) {
      let id = window.location.search.split('=')[1];
      items[id] = data;
    } else {
      items.push(data);
    }

    console.log(items);
    localForage.setItem('items', items);
    this.props.history.push('/');
  }
}

// 404 page when someone types the wrong url. not done
function Page404() {
  return(
    <div>
      <h1> 404, let's fix that! <span role="img" aria-label="Ok Hand"> 👌 </span> </h1>
    </div>
  )
}

// gets today's date used for checking if the streak can be completed today or when it was last completed
function getDate() {
  let today = new Date();
  let date = today.getFullYear()+ '-' +(today.getMonth()+1) + '-' + today.getDate();
  // let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date;
  return dateTime;
}

export default App;

// notifications + suprise streak element
// settings page
// Ability to delete Streaks
// Reorder streaks based off completed or not completed
