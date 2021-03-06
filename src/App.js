import React from 'react';
import Loading from './Components/Loading.js';
import FrontPage from './Components/FrontPage';
import Home from './Components/Home';
import New from './Components/New';
import Settings from './Components/Settings';
import Page404 from './Components/404';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import localForage from 'localforage';


// initialize data from database
let habits = [];
let todo = [];
let settings = {};

// default settings
const DefaultSettings = {
  score: 50,
  nsfw: false,
  subreddits: ["r/memes", "r/earthporn"],
};

// OPTIMIZE: this solution works but isn't optimal
class Todo extends React.Component {
  render() {
    return(
      <Home habits={false}></Home>
    )
  }

}

class Habits extends React.Component {
  render() {
    return(
      <Home habits={true}></Home>
    )
  }
}

class App extends React.Component {
  state = {
    completed: false,
  }

// Gets items from local forage in an async request
// Then renders after this.state.completed === true
  componentDidMount() {
    let keys = ['habits', 'todo', 'settings']
    const this_ = this;
    function asyncRequest(val, val2) {
      localForage.getItem(val).then(
        data => {
          if (val === 'habits') habits = data;
          if (val === 'todo') todo = data;
          if (val === 'settings') settings = data;

          if (val2) {
            this_.setState({completed: val2});
          }
        }
      )
    }

    for (var i = 0; i < keys.length; i++) {
      if ((i + 1) === keys.length) {
        asyncRequest(keys[i], true);
      } else {
        asyncRequest(keys[i], false);
      }
    }
  }

  render() {
    if (this.state.completed === false) {
      // replaced with loading screen
      return (
        <div></div>
      );
    } else {
      if (!habits) habits = [];
      if (!todo) todo = [];
      if (!settings) settings = DefaultSettings;
      return (
          <Router basename={process.env.PUBLIC_URL}>
            <div id="App">
              <Switch>
                <Route path="/" exact component={Loading}></Route>
                <Route path="/home" exact component={FrontPage}></Route>
                <Route path="/habits" exact component={Habits}></Route>
                <Route path="/todo" exact component={Todo}></Route>
                <Route path="/new" component={New}></Route>
                <Route path="/settings" exact component={Settings}></Route>
                <Route component={Page404}/>
              </Switch>
            </div>
          </Router>
        );
      }
    }
  }

let streakInterval;

function startTimer(val) {
    let _this = val;
    let timeVal = _this.state.time;

    streakInterval = setInterval(
      function() {
        timeVal--;
        _this.setState({time: timeVal});

        if (timeVal === 0) {
          _this.callBack();
        }

    }, 1000);
  }

// gets today's date used for checking if the streak can be completed today or when it was last completed
function getDate() {
  let today = new Date();
  let string = today.toString();
  return string;
}

function localStorage(val, items) {
  if (val) {
    localForage.setItem('habits', items);
  } else {
    localForage.setItem('todo', items);
  }
}

let imageData = {
  image: false,
  link: false,
};

function getImage() {
  const subreddits = settings.subreddits;
  const selectedReddit = subreddits[Math.floor(Math.random() * Math.floor(subreddits.length))];
  const redditURL = `https://www.reddit.com/${selectedReddit}/random.json`;

  return fetch(redditURL).then(function responseFunc(response) {
      response.json().then(function(data) {
        let val;
        try {
          val = data[0].data.children[0].data;
        } catch (error) {
          console.log(redditURL + error);
          getImage();
          return;
        }

         let imageURL = val.url;
         let score = val.score;
         let over18 = val.over_18;
         let imageExists;
         // only remains false if user doesn't want nsfw and the picture is nsfw
         let nsfwCheck = false;

         try {
           if (val.preview.enabled === true) {
              imageExists = true;
           } else {
             imageExists = false;
           }
         }

         catch(error) {
           imageExists = false;
         }
         // if user doesn't want nsfw and picture is not nsfw, it passes the check
         if (!settings.nsfw && !over18) {
           nsfwCheck = true;
         }
         // if user wants nsfw it passes the check, this allows sfw and nsfw content
         if (settings.nsfw) {
           nsfwCheck = true;
         }

         // quality filter
         if (imageExists && score >= settings.score && nsfwCheck) {
           let imageLink = "https://www.reddit.com" + val.permalink;
           // if (imageURL.includes("gfycat.com")) {
           //   imageURL = imageURL.replace('gfycat.com', 'giant.gfycat.com') + ".gif";
           //   console.log(imageURL);
           // }

           if (!imageData.image) {
             imageData = {
                image: imageURL,
                link: imageLink,
                nextImage: false,
                nextLink: false,
             };
           } else {
             imageData.nextImage = imageURL;
             imageData.nextLink = imageLink;
           }

           if (imageData.nextImage) {
             getImage();
           }
         } else {
           getImage();
         }
       });

       return imageData;
     }
    )
   .catch(function(err) {
     console.log('Fetch Error :-S', err);
     getImage();
   });
 }


export default App;
export { habits, todo, settings, getDate, streakInterval, startTimer, localStorage, getImage, imageData, DefaultSettings };

// expandable text area for new > title?
// Limits on goal value.
// wait until image has loaded to display image
