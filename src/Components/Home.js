import React from 'react';
import { habits } from '../App';
import Item from './Item';
import Header from './Header';
import Navigation from './Navigation';
// eslint-disable-next-line
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ReactComponent as AddIcon } from '../Assets/add.svg';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);

    this.state = {
      navDisplay: false,
    }
  }

  handler(val) {
    console.log('this thing on?');
    this.setState({
      navDisplay: val,
    })
  }

  render() {
    return (
      <div>
        {this.state.navDisplay &&
          <Navigation handler={this.handler}/>
        }
        <Header handler={this.handler}/>
        {habits.map((habits, index) =>
          <Item
            key={index}
            id={index}
            name={habits.name}
            description={habits.description}
            achieved={habits.achieved}
            goal={habits.goal}
            repeat={habits.repeat}
            completed={habits.completed}
          />
        )}
        <div id="Todo"></div>
        <div id="Complete"></div>
        <Add/>
      </div>
    );
  }
}

// Add item button
class Add extends React.Component {
  render() {
    return (
        <Link to="/new">
          <button aria-label="add" className="add">
            <AddIcon/>
          </button>
        </Link>
    )
  }
}


export default Home;
