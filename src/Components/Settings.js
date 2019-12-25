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
      <div className="settingsPage">
        <div className="backArrow" onClick={() => this.props.history.goBack()}>
          <BackArrow/>
        </div>

        <h1> Settings </h1>

        <h2> Subreddits </h2>
        <div className="inner">
          {
            this.state.subreddits.map((subreddits, index) =>
              <React.Fragment key={index}>
                <p key={index + "p"}>
                  {subreddits}
                </p>
                <CloseIcon id="deleteSub" key={index + "icon"} onClick={() => this.deleteSub(index)}></CloseIcon>
              </React.Fragment>

          )}
          <input ref="subredditInput" name="subreddits" type="text"/>
        </div>

        <h2> Post Score Filter </h2>
        <div className="inner">
          <p> This will filter out posts with lower scores, ensuring quality posts. </p>
          <p> Current Score Filter: {this.state.score} </p>
          <input ref="scoreInput" type="number" onChange={() => this.setState({score: this.refs.scoreInput.value})}/>
        </div>

        <h2> Allow NSFW Content </h2>
        <div className="inner">
          <p> Current Value: {this.state.nsfw ? "Yes" : "No"} </p>
          <form ref="nsfw">
            <input type="radio" name="nsfw" value="true"
              onChange={() => this.setState({nsfw: true})}
              /> Yes

            <input type="radio" name="nsfw" value="false"
              onChange={() => this.setState({nsfw: false})}
              /> No

           </form>
        </div>

         <h2> Delete Everything </h2>
         <div className="inner">
           <div onClick={() => this.dataDelete()}>
            <DeleteIcon></DeleteIcon>
           </div>
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

          let multiReddit = subInput.value.includes("+");

          if (multiReddit) {
            let subs = subInput.value.substring(2).split('+');
//eslint-disable-next-line
            for (var i = 0; i < subs.length; i++) {
              if (subs[i].includes('u_')) {
                subs[i] = subs[i].replace('u_', 'u/');
              } else {
                subs[i] = "r/" + subs[i];
              }
              array.push(subs[i]);
              subInput.value = "";
            }

          // BUG: Need to check if sub exists, problem async in for loops :/


          } else {
            checkSub(subInput.value).then(function(result) {
              callBack(result, subInput.value);
            });
          }

          this_.setState({subreddits: array});


          function callBack(result, value) {
            if (result) {
              array.push(value);
              subInput.value = "";
            }
          }

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
  const redditURL = `https://www.reddit.com/${sub}/.json`;

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
