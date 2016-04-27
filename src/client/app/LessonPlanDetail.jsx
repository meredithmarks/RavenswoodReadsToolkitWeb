import React from 'react';
import Constants from './constants';

class LessonPlanDetail extends React.Component {

  constructor(props) {
    super(props);
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

  render() {
    var plan = this.props.plan;
    console.log(plan);

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
        case 0:
        game = "Bingo - "
        break;
        case 1:
        game = "Memory - "
        break;
        case 7:
        game = "Letter Tiles - "
        break;
        case 5:
        game = activity.otherDescription + " - "
        break;        
      }

      return <span>{game} {activity.wordList.map(function(word, index) {
        if (index < activity.numNewWords) {
          return <span className="regular">{word}, </span>;
        } else if (index === activity.wordList.length - 1) {
          return <span>{word}</span>;
        } else {
          return <span>{word}, </span>;
        }
      })}</span>;
    };

    var renderPhonicsActivity = function(activity) {
      var game = "";
      switch (activity.game) {
        case 2:
        game = "Letter Tiles - "
        break;
        case 3:
        game = "Picture Sorts - "
        break;
        case 4:
        game = "Rainbow Writing - "
        break;
        case 6: 
        game = activity.otherDescription
        break;        
      }

      if (activity.pattern2 === "") {
        if (activity.game == 2) { // letter tiles
          if (activity.otherDescription === "") { // non-custom
            return game + activity.pattern1 + ": " + Constants.LetterTilesWordLists[Constants.PhonicsPatterns.indexOf(activity.pattern1)].join(", ");
          } else {
            return game + activity.otherDescription.replace( /\n/g, ", " );
          }
        }
        return game + activity.pattern1;
      } else {
        return game + activity.pattern1 + " vs. " + activity.pattern2;
      }
    };


    return (
        <div id="lesson-plan-all">
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
