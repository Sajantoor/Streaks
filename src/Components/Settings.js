import React from 'react';
// eslint-disable-next-line
import localForage from 'localforage';
import { subreddits } from '../App';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddits: subreddits,
    }
  }

  render() {
    let subArray = this.state.subreddits;
    return(
      <div>
        <h1> Settings </h1>

        <h2> Subreddits </h2>
        {
          subArray.map((subArray, index) =>
            <p key={index}>
              {subArray}
            </p>
        )}
        <input ref="subredditInput" type="text"/>

      </div>
    );
  }

  componentDidMount() {
    const subInput = this.refs.subredditInput;
    const this_ = this;

    subInput.addEventListener('keypress', function(e) {
      if (e.keyCode === 13) {
        if (subInput.value) {
          let array = this_.state.subreddits;

          for (var i = 0; i < array.length; i++) {
            if (array[i] === subInput.value) {
              alert('This subreddit already exists.');
              return;
            }
          }

          checkSub(subInput.value).then(function(result) {
            if (result) {
              array.push(subInput.value);
              subInput.value = "";
              this_.setState({subreddits: array});
              localForage.setItem('subreddits', array);
            } else {
              alert('Error: Check if this subreddit exists.')
            }
          })
        }
      }
    });

  }
}

function checkSub(sub) {
  const redditURL = `https://www.reddit.com/r/${sub}/random.json`;
  // console.log(redditURL);

  return fetch(redditURL).then(function dofetch(response) {
          return response.json().then(function getData(data) {

            if (data.error) {
              return false;
            } else {
              return true;
            }
         });
       }
     )
   .catch(function(err) {
     return false;
   });
}

export default Settings;
