import React from 'react';
import Constants from './constants';
import WizardQuestion from './WizardQuestion.jsx';

class WizardDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = { currentQuestion: 0 };
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

    console.log(this.state);
    // update wizard state
    // this.state.currentQuestion = id + 1;

    // get wizard dimensions
    var wizard = document.getElementsByClassName("wizard")[0];
    var wizardCenter = wizard.clientHeight / 2;

    var nextId = id + 1;
    scrollToIndex(nextId);
  }



  render() {

    var question0 = { index : 0, 
                      type : 'ChooseOne',
                      hasOptionalText : true,
                      text : 'What new book do you want to read?',
                      choices : ['See Spot Run', 'Dogs and Cats', 'Other']
                    };
    var question1 = { index : 1, 
                      type : 'ChooseOne',
                      hasOptionalText : true,
                      text : 'What new book do you want to read?',
                      choices : ['See Spot Run', 'Dogs and Cats', 'Other']
                    };
    var question2 = {index : 2};
    var question3 = {index : 3};
    var question4 = {index : 4};
    var questions = [question0, question1, question2, question3, question4];

    // The Modal
    return(
      <div className="wizard">
        <span className="close pull-right">×</span>
        <div className="questions">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>

            {questions.map(
              (function(question) {
                return <WizardQuestion key={question.index} question={question} handleNext={this.handleNext} />;
              }).bind(this)
            )}
          </form>
        </div>
      </div>
    );

  }

}

export default WizardDetail;