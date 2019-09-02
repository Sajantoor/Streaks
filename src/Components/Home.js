import React from 'react';
import { habits } from '../App';
import Item from './Item';
import Header from './Header';
import Navigation from './Navigation';
// eslint-disable-next-line
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ReactComponent as AddIcon } from '../Assets/add.svg';

let imageData = {
  image: false,
  link: false,
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);

    this.state = {
      navDisplay: false,
    }
  }

  render() {
    return (
      <div>
        {this.state.navDisplay &&
          <Navigation handler={this.handler}/>
        }
        <Header handler={this.handler}/>
        {habits.map((habits, index) =>
          <Item
            key={index}
            id={index}
            name={habits.name}
            description={habits.description}
            achieved={habits.achieved}
            goal={habits.goal}
            repeat={habits.repeat}
            completed={habits.completed}
          />
        )}
        <div id="Todo"></div>
        <div id="Complete"></div>
        <Add/>
      </div>
    );
  }

  handler(val) {
    this.setState({
      navDisplay: val,
    })
  }

// checks if the previous image has been used or not, if it has, it's set to false. 
  UNSAFE_componentWillMount() {
    if (imageData.image === false) {
      this.getImage();
    }
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
               imageData = {
                  image: imageURL,
                  link: imageLink,
               };

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

// Add item button
class Add extends React.Component {
  render() {
    return (
        <Link to="/new">
          <button aria-label="add" className="add">
            <AddIcon/>
          </button>
        </Link>
    )
  }
}


export default Home;
export { imageData };
