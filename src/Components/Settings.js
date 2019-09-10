import React from 'react';
// eslint-disable-next-line
import localForage from 'localforage';

let subreddits = ["epic", "gamer", "sauce",];

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <div>
        <h1> Settings </h1>

        <h2> Subreddits </h2>
        {
          subreddits.map((subreddits, index) =>
            <p key={index}>
              {subreddits}
            </p>
        )}
        <input type="text"/>

      </div>
    );
  }
}

export default Settings;
