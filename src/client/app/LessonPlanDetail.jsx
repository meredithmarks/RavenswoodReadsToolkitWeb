import React from 'react';
import Constants from './constants';

class LessonPlanDetail extends React.Component {

  constructor(props) {
    super(props);
    this.mailto = this.mailto.bind(this);
    this.submitExecutePlan = this.submitExecutePlan.bind(this);
  }

  _timestampToDate(timestamp) {
    var a = new Date(timestamp * 1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var day = days[a.getDay()];

    return day + ', ' + month + ' ' + date + ', ' + year;
  }

  mailto() {
    window.open('mailto:?subject=Ravenswood Reads Lesson:' + document.getElementById('lesson-plan-date').textContent + '&body=' + encodeURIComponent(document.getElementById('lesson-plan-all').textContent));
  }

  executePlan(event) {
    var modal = document.getElementById('execute-modal');
    modal.style.display = "block";

    var span = document.getElementsByClassName("execute-close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
  }

  submitExecutePlan(event) {
    event.preventDefault();
    var notes = event.target[0].value.trim();
    var key = this.props.plan['.key'];
    this.props.studentRef.child('lessonPlans').child(key).update({
      completed : true,
      notes : notes
    });
    var readBooks = this.props.student.readBooks;
    readBooks.push(this.props.plan.brandNewReadingBook);
    var highFrequencyWords = this.props.student.highFrequencyWords;
    for (var i = this.props.plan.wordBankActivity.numNewWords - 1; i >= 0; i--) {
      highFrequencyWords.unshift(this.props.plan.wordBankActivity.wordList[i]);
    }
    var currentPhonicsPattern = this.props.student.currentPhonicsPattern;
    if (Constants.PhonicsPatterns[currentPhonicsPattern] === this.props.plan.phonicsActivity.pattern1) {
      currentPhonicsPattern++;
    }
    this.props.studentRef.update({
      'currentPhonicsPattern' : currentPhonicsPattern,
      'readBooks' : readBooks,
      'highFrequencyWords' : highFrequencyWords
    });

    var modal = document.getElementById('execute-modal');
    modal.style.display = "none";
    this.props.plan.completed = true;
    this.props.plan['notes'] = notes;
    this.forceUpdate();
    return false;
  }

  render() {
    var plan = this.props.plan;

    var renderNotes = function(plan) {
      if (plan.completed) {
        return (
          <div>
            <div className="section-title">
              Lesson Notes:
            </div>
            <ul className="section-details">
              <li>{plan.notes}</li>
            </ul>
          </div>
        );
      } else {
        return;
      }
    };

    var renderWordBankActivity = function(activity) {
      var game = "";
      switch (activity.game) {
        case Constants.BingoNum:
        game = "Bingo - "
        break;
        case Constants.MemoryNum:
        game = "Memory - "
        break;
        case Constants.LetterTilesWordBankNum:
        game = "Letter Tiles - "
        break;
        case Constants.OtherWordBankNum:
        game = activity.otherDescription + " - "
        break;        
      }

      return <span>{game} {activity.wordList.map(function(word, index) {
        if (index < activity.numNewWords) {
          return <span key={word} className="regular">{word}, </span>;
        } else if (index === activity.wordList.length - 1) {
          return <span key={word}>{word}</span>;
        } else {
          return <span key={word}>{word}, </span>;
        }
      })}<br /> &mdash; {activity.notes}</span>;
    };

    var renderPhonicsActivity = function(activity) {
      var game = "";
      switch (activity.game) {
        case Constants.LetterTilesPhonicsNum:
        game = "Letter Tiles - "
        break;
        case Constants.PictureSortNum:
        game = "Picture Sort - "
        break;
        case Constants.RainbowWritingNum:
        game = "Rainbow Writing - "
        break;
        case Constants.OtherPhonicsNum: 
        game = activity.otherDescription
        break;        
      }

      var description;
      if (activity.pattern2 === "") {
        if (activity.game == Constants.LetterTilesPhonicsNum) { // letter tiles
          if (activity.otherDescription === "") { // non-custom
            description = game + activity.pattern1 + ": " + Constants.LetterTilesWordLists[Constants.PhonicsPatterns.indexOf(activity.pattern1)].join(", ");
          } else {
            description = game + activity.otherDescription.replace( /\n/g, ", " );
          }
        } else {
          description = game + ": " + activity.pattern1;
        }
      } else {
        description = game + activity.pattern1 + " vs. " + activity.pattern2;
      }
      return <span>{description} <br /> &mdash; {activity.notes} </span>
    };

    return (
      <div id="lesson-plan-all">

        <div id="execute-modal" className="modal">
          <div className="modal-content">
            <span className="execute-close">×</span>
            <form className="form-horizontal" onSubmit={this.submitExecutePlan}>

              <div className="execute-question">
                Great! How did this lesson go?
                <br></br>

                <div className="other-text">
                  <textarea rows="3" className="form-control" placeholder="What went well? What could have gone better?" />
                </div>
              </div>
            <div className="execute-question">
              <button type="submit" className="btn btn-primary">Done!</button>
            </div>
          </form>
          </div>
        </div>


        <div id="action-icons">
          <span className="glyphicon glyphicon-send" onClick={this.mailto}></span>
          <a href="javascript:window.print()"><span className="glyphicon glyphicon-print"></span></a>
          {!plan.completed &&
            <span className="glyphicon glyphicon-check" onClick={this.executePlan}></span>}

        </div>

        <div id="lesson-plan-date"> {this._timestampToDate(plan.date)} </div>
        <h2 id="lesson-plan-title">Phonics: {plan.title}</h2>
        <div className="section-title">
          Revisiting Familiar Texts:
        </div>
        <ul className="section-details">
          <li><span className="sub-section-header">Book Titles:</span> <i>{plan.rereadingBooks.join(", ")}</i></li>
        </ul>

        <div className="section-title">
          Word Study:
        </div>
        <ul className="section-details">
          <li><span className="sub-section-header">Word bank activity:</span> {renderWordBankActivity(plan.wordBankActivity)}</li>
          <li><span className="sub-section-header">Phonics activity:</span> {renderPhonicsActivity(plan.phonicsActivity)}</li>
        </ul>

        <div className="section-title">
          New Reading / Sharing a Book:
        </div>
        <ul className="section-details">
          <li><span className="sub-section-header">Book Title:</span> <i>{plan.brandNewReadingBook}</i></li>
          <li><span className="sub-section-header">Introduction:</span> Picture walk through the book, asking questions about what might happen.</li>
          <li><span className="sub-section-header">During reading:</span> Make sure your student is pointing to the words as they read! Ask comprehension questions as you go along together.</li>
          <li><span className="sub-section-header">After reading:</span> Ask for a summary of what happened in the book. Have them point out their favorite page!</li>
        </ul>

        <div className="section-title">
          Communication:
        </div>
        <ul className="section-details">
          <li><span className="sub-section-header">Notes:</span> {plan.communicationActivity.notes}</li>
        </ul>

        {renderNotes(plan)}
      </div>
    );
  }

}

export default LessonPlanDetail;
