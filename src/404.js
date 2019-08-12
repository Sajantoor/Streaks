import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { startTimer } from './App';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';

// 404 page when someone types the wrong url. not done
class Page404 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
    }
  }

  render() {
    return(
      <div className="error">
        <h1> 404, let's fix that! <span role="img" aria-label="Ok Hand"> 👌 </span> </h1>
        <h2> Redirecting you in {this.state.time} </h2>
      </div>
    )
  }

  componentDidMount() {
    startTimer(this);
  }

  back() {
    ReactDOM.render(<Router><Redirect to='/home'/></Router>, document.getElementById('root'));
    ReactDOM.render(<App/>, document.getElementById('root'));
  }
}

export default Page404;
