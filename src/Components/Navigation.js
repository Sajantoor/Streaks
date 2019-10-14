import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as SettingsIcon } from '../Assets/settings.svg';
import { ReactComponent as CloseIcon } from '../Assets/close.svg';

class Navigation extends React.Component {
  render() {
      return(
        <div className="Navigation">
          <Link to="/home">
            <h1> Streaks </h1>
          </Link>

          <Link to="/habits" onClick={() => this.props.handler(false)}>
            <h2 className="navLogo habitsLogo"> Habits </h2>
          </Link>

          <Link to="/todo" onClick={() => this.props.handler(false)}>
            <h2 className="navLogo todoLogo"> Todo </h2>
          </Link>

          <Link to="settings">
              <SettingsIcon className="settingsIcon"/>
              <h2 className="settings"> Settings </h2>
          </Link>

          <CloseIcon id="closeNav" onClick={() => this.props.handler(false)}> </CloseIcon>
        </div>
      )
    }
  }

export default Navigation;
