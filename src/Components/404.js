import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { startTimer } from '../App';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom';

// 404 page when someone types the wrong url. not done
class Page404 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
      complete: false,
    }
  }

  render() {
    return(
      <div className="error">
        {this.state.complete ? <Redirect to='/home'/> : null}
        <h1> 404, let's fix that! <span role="img" aria-label="Ok Hand"> 👌 </span> </h1>
        <h2> Redirecting you in {this.state.time} </h2>
        <h3> Or <Link to='/home'> click here </Link> </h3> 
      </div>
    )
  }

  componentDidMount() {
    startTimer(this);
  }

  callBack() {
    this.setState({complete: true});
  }
}

export default Page404;
