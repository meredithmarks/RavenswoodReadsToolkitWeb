import React from 'react';
import ReactDOM from 'react-dom';
import Constants from './constants';

class WizardQuestion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {id : props.question.index};
    this.handleNext = this.handleNext.bind(this);
  }

  handleNext(event) {
    this.props.handleNext(event, this.state.id);
  }

  render() {
    return (
    <div className="question" id={"question" + this.state.id}>
      Hi!!!
      <br></br>
      <button type="button" onClick={this.handleNext}> theButton </button>
    </div>
    );
  }

}

export default WizardQuestion;