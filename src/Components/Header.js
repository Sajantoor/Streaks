import React from 'react';
import { ReactComponent as MenuIcon } from '../Assets/menu.svg';

class Header extends React.Component {
  render() {
    return(
      <div className="header">
        { this.props.handler ? <MenuIcon onClick={this.props.handler.bind(false)} className="MenuIcon"/> : null  }

        <h1> Streaks <span role="img"  aria-label="Fire"> 🔥 </span> </h1>
      </div>
    )
  }
}

export default Header;
