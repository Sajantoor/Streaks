import React from 'react';

class Expansion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    }
  }


  render() {
    return(
      <React.Fragment>
        <div className="container">
          <div className="expansion">
            <h1>  {this.props.title} </h1>
             <p> {this.props.content} </p>
            <button style={{bottom: '0', display: 'block', margin: 'auto',}} className="NotComplete" onClick={this.props.buttonClick}>
                {this.props.buttonContent}
             </button>
              <p className="skip" onClick={this.props.skipContent}> {this.props.skip} </p>
          </div>
        </div>
      </React.Fragment>
    )
  }
}



export default Expansion;
