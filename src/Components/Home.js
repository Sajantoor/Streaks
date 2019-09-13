import React from 'react';
import { habits, todo, getImage, imageData, settings } from '../App';
import Item from './Item';
import Header from './Header';
import Navigation from './Navigation';
// eslint-disable-next-line
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ReactComponent as AddIcon } from '../Assets/add.svg';

let habitList;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);

    this.state = {
      navDisplay: false,
    }
  }

  render() {
    console.log(settings);
    let array = [];

    if (this.props.habits)  {
      array = habits;
      habitList = true;
    } else {
      array = todo;
      habitList = false;
    }

    return (
      <div>
        {this.state.navDisplay &&
          <Navigation handler={this.handler}/>
        }
        <Header handler={this.handler}/>

        {array.map((array, index) =>
          <Item
            key={index}
            id={index}
            name={array.name}
            description={array.description}
            achieved={array.achieved}
            goal={array.goal}
            repeat={array.repeat}
            completed={array.completed}
          />
        )}
        <div id="Todo"></div>
        <div id="Complete"></div>
        <Add/>
      </div>
    );
  }

  handler(val, val2) {
    this.setState({
      navDisplay: val,
      habits: val2,
    })
  }

// checks if the previous image has been used or not, if it has, it's set to false.
  UNSAFE_componentWillMount() {

    if (imageData.image === false) {
      getImage();
    }
  }
}

// Add item button
class Add extends React.Component {
  render() {
    return (
        <Link to={'/new'}>
          <button aria-label="add" className="add">
            <AddIcon/>
          </button>
        </Link>
    )
  }
}


export default Home;
export { habitList };
