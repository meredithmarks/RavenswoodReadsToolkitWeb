import React from 'react';
import Constants from './constants';
import WizardQuestion from './WizardQuestion.jsx';

class WizardDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = { currentQuestion: 0 };

    this.handleNext = this.handleNext.bind(this);
    this.handleFocusSubmit = this.handleFocusSubmit.bind(this);
    this.handleWordBankSubmit = this.handleWordBankSubmit.bind(this);
    this.handlePhonicsSubmit = this.handlePhonicsSubmit.bind(this);
    this.handleRereadingSubmit = this.handleRereadingSubmit.bind(this);
    this.handleNewReadingSubmit = this.handleNewReadingSubmit.bind(this);
    this.handleCommunicationSubmit = this.handleCommunicationSubmit.bind(this);

    this.handleLessonPlanDone = this.handleLessonPlanDone.bind(this);

    this.booksRef = new Firebase("https://rrtoolkit.firebaseio.com/books");
  }

  hideWizard(event) {
    var wizard = document.getElementsByClassName("close")[0];
    wizard.style.display = "none";
  }

  handleNext(event, id) {
    function scrollToIndex(index) {
      // get position of next question
      var nextQuestion = document.getElementById("question" + index);
      if (nextQuestion != undefined) {
        var nextQuestionFrame = nextQuestion.getBoundingClientRect();
        var top = nextQuestionFrame.top
        var height = nextQuestionFrame.bottom - top;
        var currCenter = top + height / 2;

        // scroll the difference (80 is a random number that makes this work better... ? otherwise doesn't center perfectly, unsure why)
        var delta = currCenter - wizardCenter - 80;
        var scrollTop = wizard.scrollTop + delta;
        $(".wizard").animate({scrollTop: scrollTop + "px"});
      }
    }

    // update wizard state
    // this.state.currentQuestion = id + 1;

    // get wizard dimensions
    var wizard = document.getElementsByClassName("wizard")[0];
    var wizardCenter = wizard.clientHeight / 2;

    var nextId = id + 1;
    scrollToIndex(nextId);
  }

  handleFocusSubmit(event, id) {
    this.setState({ title: event.target.target });
    this.handleNext(event, id);
  }

  handleWordBankSubmit(event, id) {
    var activity = event.target.target ? event.target.target : event.target.value
    this.setState({ wordBankActivity: activity });
    this.handleNext(event, id);
  }

  handlePhonicsSubmit(event, id) {
    var activity = event.target.target ? event.target.target : event.target.value
    this.setState({ phonicsActivity: activity });
    this.handleNext(event, id);
  }

  handleRereadingSubmit(event, id) {
    this.setState({ rereadingBooks : event.split(";") });
    this.handleNext(event, id);
  }

  handleNewReadingSubmit(event, id) {
    this.setState({ brandNewReadingBook : event });
    this.handleNext(event, id);
  }

  handleCommunicationSubmit(event, id) {
    this.setState({ communicationActivity : event.target.value });
    this.handleNext(event, id);
  }

  handleLessonPlanDone(event) {
    event.preventDefault();
    this.props.handleNewLessonPlan(this.state);
  }

  render() {

    var focusOptions = [Constants.PhonicsPatterns[this.props.student.currentPhonicsPattern]];
    if (this.props.student.currentPhonicsPattern > 0) {
      focusOptions.push(Constants.PhonicsPatterns[this.props.student.currentPhonicsPattern - 1]);
    }

    var bookOptions = [];
    if (this.props.student.readBooks !== "") {
      this.props.student.readBooks.map(function(name) {
        bookOptions.push({ value: name, label: name });
      });
    }

    var newBookOptions = [];
    this.booksRef.once("value", function(data) {
      data.forEach(function(bookSnapshot) {
        var name = bookSnapshot.key();
        // bookSnapshot.orderByChild("patterns/").once("value", function(snapshot) {
        //   snapshot.forEach(function(pattern) {
        //     console.log(pattern.val());
        //   });
        // });
        newBookOptions.push({ value: name, label: name});
      });
    });

    var question0 = { index : 0, 
                      type : 'ChooseOne',
                      hasOptionalText : false,
                      text : "What would you like to focus on today?",
                      choices : focusOptions,
                      handleSubmit : this.handleFocusSubmit
                    };
    var question1 = { index : 1, 
                      type : 'ChooseMultiple',
                      hasOptionalText : false,
                      text : "Which books would you like to reread today?",
                      choices : bookOptions,
                      handleSubmit : this.handleRereadingSubmit
                    };
    // TODO new word bank words
    var question2 = { index : 2, 
                      type : 'ChooseOne',
                      hasOptionalText : true,
                      text : 'What word bank activity would you like to do today?',
                      choices : ['Bingo', 'Memory', 'Other'],
                      handleSubmit : this.handleWordBankSubmit
                    };
    var question3 = { index : 3,
                      type : 'ChooseOne',
                      hasOptionalText : true,
                      text : 'What phonics activity would you like to do today?',
                      choices : ['Rainbow Writing', 'Picture Sort', 'Letter Tiles', 'Other'],
                      handleSubmit : this.handlePhonicsSubmit
                    };
    // TODO new reading here
    var question4 = { index : 4, 
                      type : 'Select',
                      hasOptionalText : false,
                      text : "What new book would you like to read today?",
                      choices : newBookOptions,
                      handleSubmit : this.handleNewReadingSubmit
                    };
    var question5 = { index : 5,
                      type : 'List',
                      text : 'What new words would you like to use this week?',
                      handleSubmit : this.handleNext 
                    };
    var question6 = { index : 6,
                      type : 'Text',
                      hasOptionalText : false,
                      text : 'What would you like to write about today?',
                      handleSubmit : this.handleCommunicationSubmit
                    };
    // TODO date picker here
    var question7 = { index : 7,
                      handleSubmit : this.handleNext
                    };
    var questions = [question0, question1, question2, question3, question4, question5, question6, question7];

    // The Modal
    return(
      <div className="wizard">
        <span className="close pull-right">×</span>
        <div className="questions">
          <form className="form-horizontal" onSubmit={this.handleLessonPlanDone}>

            {questions.map(
              (function(question) {
                return <WizardQuestion key={question.index} question={question} />;
              }).bind(this)
            )}
            <div className="form-group question" id={"question" + questions.length}>
              <button type="submit" className="btn btn-primary">Done!</button>
            </div>
          </form>
        </div>
      </div>
    );

  }

}

export default WizardDetail;