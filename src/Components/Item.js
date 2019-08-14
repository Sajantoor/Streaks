import React from 'react';
import { items, getDate } from '../App';
import localForage from 'localforage';
import Streaks from './Streak';
// eslint-disable-next-line
import { BrowserRouter as Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
        name: this.props.name,
        achieved: this.props.achieved,
        goal: this.props.goal,
        repeat: this.props.repeat,
        completed: this.props.completed,
        lowTime: false,
      }
  }

  render() {
     return (
       <div className="Item" ref={this.myRef}>
         <Link to={`/new?edit=${this.props.id}`}>
          <h1>{this.state.name}</h1>
          <h2>
            {this.state.lowTime ?
              <span role="img"  aria-label="Hourglass"> ⌛ </span>
              : null
            }

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
    let item = this;
    let id = this.props.id;
    let repeat = items[id].repeat;
    let domComponent = this.myRef.current;
    let date = new Date();
    let hours = date.getHours();
    let today = date.getDay();
    let lastCompleted = items[id].lastCompleted;
    let notCompleted = true;
    let lastCompletedDate = new Date(lastCompleted);

    if (lastCompleted) {
      notCompleted = false;
    }

    if (!notCompleted) {
      if (this.getExpiry(lastCompleted, repeat, id, date, domComponent, item)) {
        return;
      }
    }

    if (repeat === 'Sunday') repeat = 0;
    if (repeat === 'Monday') repeat = 1;
    if (repeat === 'Tuesday') repeat = 2;
    if (repeat === 'Wednesday') repeat = 3;
    if (repeat === 'Thursday') repeat = 4;
    if (repeat === 'Friday') repeat = 5;
    if (repeat === 'Saturday') repeat = 6;

    if (!notCompleted && date.setHours(0,0,0,0) === lastCompletedDate.setHours(0,0,0,0)) {
      document.getElementById('Complete').prepend(domComponent);
      items[id].completed = true;
      item.setState({completed: true});
      localForage.setItem('items', items);
      return;
    }

    function streaked() {
      document.getElementById('Todo').prepend(domComponent);
      items[id].completed = false;
      item.setState({completed: false});
      localForage.setItem('items', items);
      return;
    }

    if (repeat === today && hours > 8) streaked();

    else if (repeat === "Daily" && (repeat && hours > 8)) streaked();

    else if (repeat === "Weekdays" && ((today >= 1 && today <= 5) && hours > 8)) streaked();

    else if (repeat === "Weekends" && (((today === 0) || (today === 6)) && hours > 8)) streaked();

    else {
      document.getElementById('Complete').prepend(domComponent);
      items[id].completed = true;
      item.setState({completed: true});
      localForage.setItem('items', items);
      return;
    }
  }

  getExpiry(lastCompleted, repeat, id, date, domComponent, item) {
    let expiry = new Date(lastCompleted);
    let lastCompletedDate = expiry;
    let lastDate = lastCompletedDate.getDate();
    let completedDay = lastCompletedDate.getDay();

    if (repeat === 'Daily') {
       expiry.setHours(48,0,0,0);
    }

    else if (repeat === 'Weekends') {
      if (completedDay === 6) {
        expiry.setHours(48,0,0,0);
      } else {
        expiry.setDate(lastDate + 6);
        expiry.setHours(48,0,0,0);
      }
    }

    else if (repeat === "Weekdays") {
      if (completedDay === 5) {
        expiry.setDate(lastDate + 3);
        expiry.setHours(48,0,0,0);
      } else {
        expiry.setHours(48,0,0,0);
      }
    }

    else {
      expiry.setHours(216,0,0,0);
    }

    checkExpiry();

    function checkExpiry() {
      let x = new Date(date);
      x.setHours(x.getHours()+ 4);

      if (x.getTime() > expiry.getTime()) {
        item.setState({lowTime: true});
      }

      if (date > expiry) {
        domComponent.remove();
        items.splice(id, 1);
        localForage.setItem('items', items);
        return true;
      }
    }
  }
  // Handles the completion of the streak
  streakComplete() {
    if (this.state.completed === false) {
        let currentTime = getDate();
        let achievedVal = this.state.achieved;
        let id = this.props.id;
        let domComponent = this.myRef.current;
        let completeList = document.getElementById('Complete');

        this.setState({completed: true});
        this.setState({achieved: achievedVal + 1});
        this.setState({lastCompleted: currentTime});
        completeList.prepend(domComponent);

        // Puts data into items JSON
        items[id].achieved = achievedVal + 1;
        items[id].completed = true;
        items[id].lastCompleted = currentTime;
        localForage.setItem('items', items);
        ReactDOM.render(<Streaks time="10"/>, document.getElementById('root'));
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

export default Item;
