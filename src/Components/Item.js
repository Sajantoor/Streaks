import React from 'react';
import ReactDOM from 'react-dom';
import { habits, todo, getDate, localStorage } from '../App';
import { habitList } from './Home.js';
import Streaks from './Streak';
import Expansion from './Expansion';
import { Link } from 'react-router-dom';

let items;
let date = new Date();
let hours = date.getHours();
let today = date.getDay();

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
        achieved: parseInt(this.props.achieved),
        goal: parseInt(this.props.goal),
        completed: this.props.completed,
        lowTime: false,
        expansion: false,
      }
  }

  render() {
     return (
       <div>
         <div className="Item" id={!habitList ? "todo" : null} ref={this.myRef}>
           <Link to={`/new?edit=${this.props.id}`}>
            <h1 className={this.state.completed ? "strikethrough" : null}>{this.props.name}</h1>

          { habitList &&
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
          }
          </Link>

          {habitList &&
            <React.Fragment>
              <Progress percentage={this.state.percentage}></Progress>
              <h3> {this.state.percentage}% Complete </h3>
            </React.Fragment>
          }

          <button aria-label="complete" className={
                this.state.completed ? "Complete" : "NotComplete"
              } onClick={() => {if (this.state.completed === false) {this.streakComplete()}} }>
               Streak <span role="img"  aria-label="Fire"> 🔥 </span>
            </button>
         </div>

         {this.state.expansion ?
            this.state.expansion : null
         }
       </div>
     );
  }

  // When the component is mounted then it runs streak check
  componentDidMount() {
    if (habitList) {
      items = habits;
      this.setState({percentage: calcPercentage(this.state.achieved, this.state.goal)});
      this.streakCheck();
    } else {
      items = todo;
      this.todoCheck();
    }
  }

  todoCheck() {
    let domComponent = this.myRef.current;
    const id = this.props.id;
    let repeat = items[id].repeat;

    if (this.state.completed) {
      document.getElementById('Complete').prepend(domComponent);

      let lastCompletedDate = new Date(items[id].lastCompleted);
      // check expiry
      if (!(date.setHours(0,0,0,0) === lastCompletedDate.setHours(0,0,0,0))) {

        if (repeat === "false") repeat = false;
        if (repeat) {

          this.repeatCheck(repeat, this, id, domComponent);
        } else {
          this.delete(id, domComponent);
        }
      }
    } else {
      document.getElementById('Todo').prepend(domComponent);
    }
  }
  // Check whether of not today is the day where the streak can be completed,
  // if not then streak is marked as completed until it's able to be completed.
  streakCheck() {
    const item = this;
    const id = this.props.id;
    const lastCompleted = items[id].lastCompleted;
    const domComponent = this.myRef.current;
    let repeat = items[id].repeat;
    let notCompleted = true;

    if (this.state.goal === this.state.achieved) {
      let val = <span role="img"  aria-label="Party Popper"> 🎉</span>
      this.setState({
        expansion: <Expansion
          title={[val, `Congrats, you have reached your goal for "${this.props.name}"!`, val]}
          content="Here's a challenge, set your goal to: "
          buttonContent={this.state.goal + 30}
          buttonClick={() => goalChange(item, id, items)}
          skip="delete"
          skipContent={() =>  {
            this.delete(id, domComponent);
            this.setState({expansion: false})
          }}
        ></Expansion>
      });

      function goalChange(this_, id, items) {
        let val = this_.state.goal + 30;
        items[id].goal = val;
        this_.setState({
          goal: val,
          expansion: false,
          percentage: calcPercentage(this_.state.achieved, val),
        });
        localStorage(habitList, items);
      }

    }
    // checks if completed or not
    if (lastCompleted) {
      notCompleted = false;
      this.repeatCheck(repeat, item, id, domComponent);
    } else {
      this.repeatCheck(repeat, item, id, domComponent);
    }
    // if completed, checks if it's expired or not

    if (!notCompleted && this.getExpiry(lastCompleted, repeat, id, date, domComponent, item)) return;

    let lastCompletedDate = new Date(lastCompleted);
    // if today is equal to last completed date, then it marks it as complete
    // DEBUG: Remove "!" to debug streak element
    if (!notCompleted && date.setHours(0,0,0,0) === lastCompletedDate.setHours(0,0,0,0)) {
      document.getElementById('Complete').prepend(domComponent);
      items[id].completed = true;
      item.setState({completed: true});
      localStorage(habitList, items);
      return;
    }
  }

  repeatCheck(repeat, item, id, domComponent) {
    if (repeat === 'Sunday') repeat = 0;
    if (repeat === 'Monday') repeat = 1;
    if (repeat === 'Tuesday') repeat = 2;
    if (repeat === 'Wednesday') repeat = 3;
    if (repeat === 'Thursday') repeat = 4;
    if (repeat === 'Friday') repeat = 5;
    if (repeat === 'Saturday') repeat = 6;

    if (repeat === today && hours > 8) streaked();
    else if (repeat === "Daily" && (repeat && hours > 8)) streaked();
    else if (repeat === "Weekdays" && ((today >= 1 && today <= 5) && hours > 8)) streaked();
    else if (repeat === "Weekends" && (((today === 0) || (today === 6)) && hours > 8)) streaked();

    else {
      document.getElementById('Complete').prepend(domComponent);
      items[id].completed = true;
      item.setState({completed: true});
      localStorage(habitList, items);
      return;
    }

    function streaked() {
      document.getElementById('Todo').prepend(domComponent);
      items[id].completed = false;
      item.setState({completed: false});
      localStorage(habitList, items);
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

    // once a week ones
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
        document.getElementById('Todo').prepend(domComponent);
        items[id].completed = false;
        items[id].achieved = 0;
        item.setState({
          completed: false,
          achieved: 0,
          lowTime: false,
          percentage: 0,
        });
        localStorage(habitList, items);
      }
    }
  }

  // Handles the completion of the streak
  streakComplete() {
      let currentTime = getDate();
      let achievedVal = this.state.achieved;
      let id = this.props.id;
      let domComponent = this.myRef.current;
      let completeList = document.getElementById('Complete');

      this.setState({
        completed: true,
        achieved: achievedVal + 1,
        lastCompleted: currentTime,
        percentage: calcPercentage(this.state.achieved, this.state.goal),
      });
      completeList.prepend(domComponent);

      // Puts data into habits JSON
      items[id].achieved = achievedVal + 1;
      items[id].completed = true;
      items[id].lastCompleted = currentTime;
      localStorage(habitList, items);
      ReactDOM.render(<Streaks time="10"/>, document.getElementById('root'));
  }

  delete(id, domComponent) {
    items.splice(id, 1);
    localStorage(habitList, items);
    domComponent.remove();
    return true;
  }
}

// Calculates the percentage between 2 values.
function calcPercentage(val1, val2) {
  let percentage = (val1 / val2) * 100;
  percentage = parseInt(percentage);
  return percentage;
}

class Progress extends React.Component {
  render() {
    return(
      <div className="progress-bar">
        <div className="filler"  style={{width: `${this.props.percentage}%`}}></div>
      </div>
    )
  }
}

export default Item;
