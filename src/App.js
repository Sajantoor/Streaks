import React from 'react';
import Home from './Components/Home';
import New from './Components/New';
import Page404 from './Components/404';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import localForage from 'localforage';

// initialize items as global
let items = [];

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
      if (!items) items = [];
      return (
          <Router>
            <div id="App">
            <Switch>
            {  // branding and waiting to fetch data base path
            //  <Route path="/" exact component={Home}></Route>
            }
              <Route path="/home"  component={Home}></Route>
              <Route path="/new" component={New}></Route>
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
          _this.back();
        }

    }, 1000);
  }

// gets today's date used for checking if the streak can be completed today or when it was last completed
function getDate() {
  let today = new Date();
  let date = today.getFullYear()+ '-' +(today.getMonth()+1) + '-' + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date + "/" + time;
  return dateTime;
}


export default App;
export { items, getDate, streakInterval, startTimer };

// settings page
// streak needs to break 24 hours after last opportunity to complete it
// Reorder by dragging
// Limits on goal value.
// What happens at 100%? => new goal or removal of streak!
// wait until image has loaded to display image
