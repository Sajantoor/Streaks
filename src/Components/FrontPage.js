import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';

class FrontPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: false,
    }
  }

  render() {
    return(
      <div>
        <Header/>
        <Link to="/habits">
          <h1 className="habitLogo"> Streaks: Habit Tracker </h1>
        </Link>

        <Link to="/todo">
          <h1 className="navLogo todoLogo"> Streaks: Todo List </h1>
        </Link>
      </div>
    );
  }
}

export default FrontPage;


// Front page is login page
// Checks if user is logged in.

// Streak score and profile will be added to the front page too, adding friends / competition
