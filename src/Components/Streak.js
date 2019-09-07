import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { startTimer, streakInterval } from '../App';
import { imageData, getImage } from './Home';
// import { BrowserRouter as Route, Link } from 'react-router-dom';
import { ReactComponent as LinkIcon } from '../Assets/link.svg';
import ProgressBar from './ProgressBar';

class Streak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
      image: imageData.image,
    }
  }

  render() {
    return(
        <div className="streak">
          {this.state.image ?
            <React.Fragment>
              <img
                className="background"
                src={imageData.image}
                alt="" >
              </img>

              <img
                src={imageData.image}
                className="image"
                onLoad={() => startTimer(this)}
                alt=""
                onClick={() => this.callBack()}
                >
              </img>

              <a href={imageData.link}> <button> <LinkIcon/> </button> </a>
              <h1> {this.state.time} </h1>
            </React.Fragment>
            :
            <ProgressBar/>

          }
        </div>
    )
  }

// Sets image to false, thus image won't be regenerated everytime the home component is rendered
  componentWillUnmount() {
    imageData.image = false;
    console.log(imageData);
  }

  callBack() {
    clearInterval(streakInterval);
    ReactDOM.render(<App/>, document.getElementById('root'));
  }
}

  export default Streak;
