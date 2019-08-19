import React from 'react';
import { Redirect } from 'react-router-dom';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
    }
  }

  render() {
    return(
      <div className="loading">
        {this.state.complete ? <Redirect to='/home'/> : null}
        <h1> Streaks  <span role="img"  aria-label="Fire"> 🔥 </span> </h1>
      </div>
    )
  }

  componentDidMount() {
    let _this = this;
    setTimeout(function() {
      _this.setState({complete: true})
    }, 2000)
  }
}

export default Loading;
