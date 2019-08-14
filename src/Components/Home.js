import React from 'react';
import { items } from '../App';
import Item from './Item';
// eslint-disable-next-line
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { ReactComponent as AddIcon } from '../Assets/add.svg';


class Home extends React.Component {
  render() {
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
          <button className="add">
            <AddIcon/>
          </button>
        </Link>
    )
  }
}


export default Home;
