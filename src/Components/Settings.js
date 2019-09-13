import React from 'react';
// eslint-disable-next-line
import localForage from 'localforage';
import { settings as settingsVal, DefaultSettings  } from '../App';
import { ReactComponent as BackArrow } from '../Assets/back-arrow.svg';
import { ReactComponent as CloseIcon } from '../Assets/close.svg';
import { ReactComponent as DeleteIcon } from '../Assets/delete.svg';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nsfw: settingsVal.nsfw,
      score: settingsVal.score,
      subreddits: settingsVal.subreddits,
    }
  }

  render() {
    return(
      <div>
        <div onClick={() => this.props.history.goBack()}>
          <BackArrow/>
        </div>

        <h1> Settings </h1>

        <h2> Subreddits </h2>
        {
          this.state.subreddits.map((subreddits, index) =>
            <React.Fragment key={index}>
              <p key={index + "p"}>
                {subreddits}
              </p>
              <CloseIcon key={index + "icon"} onClick={() => this.deleteSub(index)}></CloseIcon>
            </React.Fragment>

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


         <h2> Delete all Data </h2>
         <div onClick={() => this.dataDelete()}>
          <DeleteIcon></DeleteIcon>
         </div>


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
            } else {
              alert('Error: Check if this subreddit exists.')
            }
          })
        }
      }
    });

  }

  componentWillUnmount() {
    // OPTIMIZE: could be optimized
    settingsVal.nsfw = this.state.nsfw;
    settingsVal.score = this.state.score;
    settingsVal.subreddits = this.state.subreddits;
    localForage.setItem('settings', settingsVal);
    console.log(settingsVal);
  }

  deleteSub(id) {
    let subreddits = this.state.subreddits;

    if (subreddits[1]) {
      subreddits.splice(id, 1);
      this.setState({subreddits: subreddits});
    } else {
      alert("There are no more subreddits left, please add a subreddit before removing this one.");
    }
  }

  dataDelete() {
    const this_ = this;
    localForage.clear().then(function() {
      console.log('Database is now empty.');
      localForage.setItem('settings', DefaultSettings);
      this_.setState({
        nsfw: DefaultSettings.nsfw,
        score: DefaultSettings.score,
        subreddits: DefaultSettings.subreddits,
      })
    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
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
