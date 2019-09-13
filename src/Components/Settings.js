import React from 'react';
// eslint-disable-next-line
import localForage from 'localforage';
import { settings } from '../App';
import { ReactComponent as BackArrow } from '../Assets/back-arrow.svg';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nsfw: settings.nsfw,
      score: settings.score,
      subreddits: settings.subreddits,
    }
  }

  render() {
    let subArray = this.state.subreddits;
    return(
      <div>
        <div onClick={() => this.props.history.goBack()}>
          <BackArrow/>
        </div>

        <h1> Settings </h1>

        <h2> Subreddits </h2>
        {
          subArray.map((subArray, index) =>
            <p key={index}>
              {subArray}
            </p>

        )}
        <input ref="subredditInput" name="subreddits" type="text"/>

        <h2> Post Score Filter </h2>
        <p> This will filter out posts with lower scores, ensuring quality posts. </p>
        <p> Current Score Filter: {this.state.score} </p>

        <input ref="scoreInput" type="number" onChange={() => this.setState({score: this.refs.scoreInput.value})}/>

        <h2> Allow NSFW Content </h2>
        <p> Current Value: {this.state.nsfw ? "Yes" : "No"} </p>
        <form ref="nsfw">
          <input type="radio" name="nsfw" value="true"
            onChange={() => this.setState({nsfw: true})}
            /> Yes

          <input type="radio" name="nsfw" value="false"
            onChange={() => this.setState({nsfw: false})}
            /> No

         </form>


        {// Login with reddit
        }


        {// login with instagram
        }
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

  componentWillUnmount() {
    console.log(this.state);
    localForage.setItem('settings', this.state);
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
