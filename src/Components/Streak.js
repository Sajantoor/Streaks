import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { startTimer, streakInterval } from '../App';
// import { BrowserRouter as Route, Link } from 'react-router-dom';
import { ReactComponent as LinkIcon } from '../Assets/link.svg';
import ProgressBar from './ProgressBar';

class Streak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
      image: false,
      link: false,
    }
  }

  componentWillMount() {
    this.getImage();
  }

  render() {
    return(
        <div className="streak">
          {this.state.image ?
            <React.Fragment>
              <img
                className="background"
                src={this.state.image}
                alt="" >
              </img>

              <img
                src={this.state.image}
                className="image"
                onLoad={() => startTimer(this)}
                alt=""
                onClick={() => this.callBack()}
                onError={() => this.getImage()} >
              </img>

              <a href={this.state.link}> <button> <LinkIcon/> </button> </a>
              <h1> {this.state.time} </h1>
            </React.Fragment>
            :
            <ProgressBar/>
          }
        </div>
    )
  }

  callBack() {
    clearInterval(streakInterval);
    ReactDOM.render(<App/>, document.getElementById('root'));
  }

  getImage() {
    const _this = this;
    const subReddit = ["memes", "earthporn", "spaceporn", "art"]
    const selectedReddit = subReddit[Math.floor(Math.random() * Math.floor(subReddit.length))];
    const redditURL = `https://www.reddit.com/r/${selectedReddit}/random.json`;

    fetch(redditURL).then(function(response) {
            response.json().then(function(data) {
             console.log(data);
             let val = data[0].data.children[0].data;
             let imageURL = val.url;
             let score = val.score;
             let over18 = val.over_18;
             let imageExists;

             try {
               if (val.preview.enabled === true) {
                  imageExists = true;
               } else {
                 imageExists = false;
               }
             }

             catch(error) {
               console.log(error);
               imageExists = false;
             }

             // quality filter
             if (imageExists && score >= 50 && !over18) {
               let imageLink = "https://www.reddit.com" + val.permalink;
               _this.setState({
                 image: imageURL,
                 link: imageLink,
               });
             } else {
               _this.getImage();
             }
           });
         }
       )
       .catch(function(err) {
         console.log('Fetch Error :-S', err);
       });
     }
  }

  export default Streak;
