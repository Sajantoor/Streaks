import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as SettingsIcon } from '../Assets/settings.svg';
import { ReactComponent as CloseIcon } from '../Assets/close.svg';

class Navigation extends React.Component {
  render() {
      return(
        <div className="Navigation">
          <h1> Streaks </h1>
          <Link to="/habits">
            <h2> Streaks: Habit Tracker </h2>
          </Link>
          <Link to="/todo">
            <h2> Streaks: Todo </h2>
          </Link>

          <Link to="settings">
              <SettingsIcon/>
          </Link>
          <CloseIcon onClick={() => this.props.handler(false)}> </CloseIcon>
        </div>
      )
    }
  }

export default Navigation;
