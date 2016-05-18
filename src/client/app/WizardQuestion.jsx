import React from 'react';
import ReactDOM from 'react-dom';
import Constants from './constants';
import Select from 'react-select';
import { Button, ButtonGroup } from 'react-bootstrap';

class WizardQuestion extends React.Component { 

  constructor(props) {
    super(props);
    this.state = {  id : props.question.index, 
                    question : props.question,
                    listEntries: [],
                    tags: []
                  };

    this.handleNext = this.handleNext.bind(this);

    this.chooseMultipleHandleNext = this.chooseMultipleHandleNext.bind(this);

    /* Choose one Multiple Choice Handlers */
    this.chooseOneHandleNext = this.chooseOneHandleNext.bind(this);
    this.chooseOneCustomHandleNext = this.chooseOneCustomHandleNext.bind(this);
    this.chooseOneCustomHandleKeyboard = this.chooseOneCustomHandleKeyboard.bind(this);
    this.chooseOneCustomHandleChange = this.chooseOneCustomHandleChange.bind(this);

    /* Tag input handlers*/
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleNext(event) {
    this.props.question.handleSubmit(event, this.state.id);
  }

  /*
   * Choose one handlers
   */
  chooseOneCustomHandleChange(event) {
    this.setState({ customText: event.target.value});
  }

  // If someone types enter in a custom text box, go to the next question
  chooseOneCustomHandleKeyboard(event) {
    if (event.key === 'Enter' && !event.shiftKey){
      event.preventDefault();
      this.handleNext(event);
    }
  }

  chooseOneCustomHandleNext(event) {
    event.preventDefault();
    this.handleNext(event);
  }

  chooseOneHandleNext(event) {
    event.preventDefault();

    var chosen = event.target.target;
    var optionalChoice = this.state.question.choices[(this.state.question.choices.length - 1)];
    
    this.setState({ selectedChoice: chosen});
    if (!this.state.question.hasOptionalText || chosen != optionalChoice) {
      this.handleNext(event);
    }
  }

  /* 
   * List handlers
   */
  handleDelete(i) {
    var tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({tags: tags});
  }

  handleAddition(tag) {
    var tags = this.state.tags;
    tags.push({
        id: tags.length + 1,
        text: tag
    });
    this.setState({tags: tags});
  }

  handleDrag(tag, currPos, newPos) {
    var tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: tags });
  }

  /* 
   * Choose Multiple handlers
   */
  chooseMultipleHandleNext(value) {
    this.setState({ values: value });

    this.handleNext(value);
  }

  render() {
    // Choose one multiple choice
    if (this.state.question.type == 'ChooseOne') {
      return ( 
        <div className="question" id={"question" + this.state.id}>
          { this.state.question.text }
          <br></br>

          <div className="form-group">
            <div className="btn-group" data-toggle="buttons">
            <ButtonGroup>
              {this.state.question.choices.map(
                (function(choice) {
                  return <Button key={choice} target={choice} onClick={this.chooseOneHandleNext} active={this.state.selectedChoice === choice}>{choice}</Button>;
                }).bind(this)
              )}
            </ButtonGroup>
            </div>
          </div>

          { this.state.question.hasOptionalText && this.state.selectedChoice === this.state.question.choices[this.state.question.choices.length-1] && // or ? ______ : }
            <div className="form-group  other-text">
                <textarea rows="3" className="form-control" id={"custom-text-" + this.state.id} placeholder="Describe your activity here!" onChange={this.chooseOneCustomHandleChange} onKeyUp={this.chooseOneCustomHandleKeyboard}/>
            </div>
          }

        </div>
      );
    } else if (this.state.question.type == 'List') {
        var ReactTags = require('react-tag-input').WithContext;
        var tags = this.state.tags;
        var suggestions = this.state.suggestions;
        return (
          <div className="question" id={"question" + this.state.id}>
            { this.state.question.text }
            <br></br>
            <div className = "list">
              <ReactTags tags={tags}
                  suggestions={[]}
                  handleDelete={this.handleDelete}
                  handleAddition={this.handleAddition}
                  handleDrag={this.handleDrag}
                  placeholder="..."
                  minQueryLength={2}>
              </ReactTags>
            </div>
          </div>
        )
    } else if (this.state.question.type == 'ChooseMultiple') {
      return ( 
        <div className="question" id={"question" + this.state.id}>
          { this.state.question.text }
          <br></br>

          <div className="form-group">
            <div>
              <Select
                name="books"
                value={this.state.values}
                multi={true}
                options={this.props.question.choices}
                simpleValue={true}
                delimiter=";"
                onChange={this.chooseMultipleHandleNext}
              />
            </div>
          </div>

        </div>
      );
    } else if (this.state.question.type == 'Text') {
      return (
        <div className="question" id={"question" + this.state.id}>
          { this.state.question.text }
          <br></br>

          <div className="form-group  other-text">
              <textarea rows="3" className="form-control" id={"custom-text-" + this.state.id} placeholder="Describe your activity here!" onChange={this.chooseOneCustomHandleChange} onKeyUp={this.chooseOneCustomHandleKeyboard}/>
          </div>
        </div>
      );
    } else if (this.state.question.type == 'OtherType') {
      // ...
    } else {
      // ...
    }

    // Default filler button
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