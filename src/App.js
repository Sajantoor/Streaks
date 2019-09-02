import React from 'react';
import Loading from './Components/Loading.js';
import FrontPage from './Components/FrontPage';
import Home from './Components/Home';
import New from './Components/New';
import Settings from './Components/Settings';
import Page404 from './Components/404';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import localForage from 'localforage';

// initialize items as global
let habits = [];
let todo = [];

class App extends React.Component {
  state = {
    completed: false,
  }

// Gets items from local forage in an async request
// Then renders after this.state.completed === true
  componentDidMount() {
    this._asyncRequest = localForage.getItem('habits').then(
      data => {
        this._asyncRequest = null;
        habits = data;
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
        <div></div>
      );
    } else {
      if (!habits) habits = [];
      return (
          <Router basename={process.env.PUBLIC_URL}>
            <div id="App" className={this.props.className}>
            <Switch>
              <Route path="/" exact component={Loading}></Route>
              <Route path="/home"  component={FrontPage}></Route>
              <Route path="/Habits"  component={Home}></Route>
              <Route path="/Todo" component={Home}></Route>
              <Route path="/new" component={New}></Route>
              <Route path="/settings" component={Settings}></Route>
              <Route component={Page404}/>
            </Switch>
            </div>
          </Router>
        );
      }
    }
  }

let streakInterval;

function startTimer(val) {
    let _this = val;
    let timeVal = _this.state.time;

    streakInterval = setInterval(
      function() {
        timeVal--;
        _this.setState({time: timeVal});

        if (timeVal === 0) {
          _this.callBack();
        }

    }, 1000);
  }

// gets today's date used for checking if the streak can be completed today or when it was last completed
function getDate() {
  let today = new Date();
  let string = today.toString();
  console.log(string);
  return string;
}


export default App;
export { habits, getDate, streakInterval, startTimer };


// expandable text area for new > title?
// settings page
// Limits on goal value.
// wait until image has loaded to display image
