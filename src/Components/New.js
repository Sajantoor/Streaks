import React from 'react';
import { habits, todo, localStorage } from '../App';
import { ReactComponent as CloseIcon } from '../Assets/close.svg';
import { ReactComponent as DeleteIcon } from '../Assets/delete.svg';
import { habitList } from './Home';
// eslint-disable-next-line
import { BrowserRouter as Route, Link } from 'react-router-dom';

let items;

class New extends React.Component {
  render() {
    return (
    <div className="new" id="new">
        <button aria-label="close" onClick={() => this.props.history.goBack()} id="close">
          <CloseIcon/>
        </button>

      <button aria-label="done" id="done" onClick={() => this.addItem()}> Done </button>

    { window.location.search ?
        <button aria-label="delete" id="delete" onClick={() => this.deleteItem()}>
          <DeleteIcon/>
        </button>
      : null }
        <input id="title" ref="title" type="text" placeholder="Streak Title"></input>
        <div className="content"></div>
        <textarea id="description" ref="description" placeholder="Enter your streak description!"></textarea>

      <div className="below">
        <select id="repeat" ref="repeat">
        {!habitList &&
          <option value="false"> None </option>
        }
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

        {habitList &&
          <React.Fragment>
            <input id="goal" ref="goal" type="number" placeholder="30"></input>
            <h2> Goal </h2>
          </React.Fragment>
        }

      </div>
    </div>
    )
  }

  componentDidMount() {
    if (habitList) {
      items = habits;
    } else {
      items = todo;
    }

    this.checkEnter = this.checkEnter.bind(this);
    window.addEventListener('keypress', this.checkEnter);
    document.body.style = " background: #FFF;";
    if (window.location.search) {
      this.editItem();
    }
  }

  componentWillUnmount() {
    document.body.removeAttribute('style');
    window.removeEventListener('keypress', this.checkEnter);
  }

  editItem() {
    // check if link is valid here
    const id = window.location.search.split('=')[1];

    try {
      this.refs.title.value = items[id].name;
      this.refs.description.value = items[id].description;
      this.refs.repeat.value = items[id].repeat;
      if (habitList) {
        this.refs.goal.value = items[id].goal;
      }
    }

    catch(error) {
      console.log(error);
      this.props.history.push('/404');
    }
  }

  addItem() {
    const name = this.refs.title.value;
    const description = this.refs.description.value;
    const repeat = this.refs.repeat.value;
    let goal;
    if (habitList) {
      goal = this.refs.goal.value;
    } else {
      goal = null;
    }

    if ((habitList && !(name && repeat && goal)) || !(name)) {
      alert("Invalid submission: Required fields, name, repeat and goal, are not filled in!.")
      return;
    }

    if (habitList && goal < 0) {
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

    // If this is an edited item
    if (window.location.search) {
      const id = window.location.search.split('=')[1];
      let previousRepeat = items[id].repeat;
      // eslint-disable-next-line
      if (repeat == previousRepeat) {
          data.lastCompleted = items[id].lastCompleted;
      }
      // Fixes but where if you change the repeat, the streak is marked as not complete and that can be exploited
        data.achieved = (items[id].achieved - 1);
        if (data.achieved < 0) data.achieved = 0;
        data.completed = items[id].completed;
        items[id] = data;
    } else {
      items.push(data);
    }

    localStorage(habitList, items);
    this.props.history.goBack();
  }

  deleteItem() {
    const id = window.location.search.split('=')[1];
    items.splice(id, 1);
    localStorage(habitList, items);
    this.props.history.goBack();
  }

  checkEnter(e) {
    if (e.keyCode === 13) {
      this.addItem();
    }
  }
}

export default New;
