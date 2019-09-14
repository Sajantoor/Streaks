import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
// eslint-disable-next-line
import { startTimer, streakInterval, imageData, getImage } from '../App';
// import { BrowserRouter as Route, Link } from 'react-router-dom';
import { ReactComponent as LinkIcon } from '../Assets/link.svg';
import ProgressBar from './ProgressBar';

class Streak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
      image: imageData.image,
      link: imageData.link
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

              <a href={this.state.link}> <button> <LinkIcon/> </button> </a>
              <h1> {this.state.time} </h1>
            </React.Fragment>
            :
            <ProgressBar/>
          }
        </div>
    )
  }

  componentDidMount() {
    const this_ = this;
    function getImageAgain() {
      if (!this_.state.image) {

        getImage().then(function(result) {
          console.log(result);
          if (!result.image) {
            getImageAgain();
          }

          this_.setState({
            image: result.image,
            link: result.link,
          });
        })
      }
    }

    getImageAgain();
  }

// Sets image to false, thus image won't be regenerated everytime the home component is rendered
  componentWillUnmount() {
    imageData.image = imageData.nextImage;
    imageData.link = imageData.nextLink;
    imageData.nextImage = false;
    imageData.nextLink = false;
  }

  callBack() {
    clearInterval(streakInterval);
    ReactDOM.render(<App/>, document.getElementById('root'));
  }
}

  export default Streak;
