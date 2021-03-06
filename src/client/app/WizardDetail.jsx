import React from 'react';
import Constants from './constants';
import WizardQuestion from './WizardQuestion.jsx';

class WizardDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wordBankActivity: {
        otherDescription : "",
        wordList: [],
        notes : "Remember to demonstrate the activity first for your child!" },
      phonicsActivity: {
        otherDescription : "",
        notes : "Make sure your student knows the meaning of the words you discuss!" },
      completed: false };

    this.handleNext = this.handleNext.bind(this);
    this.handleFocusSubmit = this.handleFocusSubmit.bind(this);
    this.handleWordBankSubmit = this.handleWordBankSubmit.bind(this);
    this.handlePhonicsSubmit = this.handlePhonicsSubmit.bind(this);
    this.handleRereadingSubmit = this.handleRereadingSubmit.bind(this);
    this.handleNewReadingSubmit = this.handleNewReadingSubmit.bind(this);
    this.handleCommunicationSubmit = this.handleCommunicationSubmit.bind(this);
    this.handleWordBankWordsSubmit = this.handleWordBankWordsSubmit.bind(this);
    this.handleWordBankActivityWordsSubmit = this.handleWordBankActivityWordsSubmit.bind(this);
    this.handleWordBankNotesSubmit = this.handleWordBankNotesSubmit.bind(this);
    this.handlePhonicsNotesSubmit = this.handlePhonicsNotesSubmit.bind(this);
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
    this.handleLessonPlanDone = this.handleLessonPlanDone.bind(this);

    this.booksRef = new Firebase("https://rrtoolkit.firebaseio.com/books");
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
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

    // get wizard dimensions
    var wizard = document.getElementsByClassName("wizard")[0];
    var wizardCenter = wizard.clientHeight / 2;

    var nextId = id + 1;
    scrollToIndex(nextId);
  }

  handleFocusSubmit(event, id, otherJustSelected) {
    if (otherJustSelected) {
      this.setState({ title: undefined });
      return;
    }

    var title = event.target.target;
    if (title) {
      title = title.substring(title.indexOf(' ') + 1);
    } else {
      title = event.target.value.trim();
    }
    this.setState({ title: title });

    // TODO: this is buggy in an off edge-case. 
    //       Fix to just reset phonics activity to unset!

    // update phonics activity with new patterns
    if (typeof this.state.phonicsActivity.game != undefined) {
      var activity = this.state.phonicsActivity;
      activity.pattern1 = title;
      switch (activity.game) {
        case Constants.PictureSortNum:
          var index = Constants.PhonicsPatterns.indexOf(title);
          index = index === 0 ? 1 : index - 1;
          activity.pattern2 = Constants.PhonicsPatterns[index];
        default:
          activity.pattern2 = "";
          break;
      }

      this.setState({ phonicsActivity: activity });
    }

    // solution 2:
    // this.setState({ phonicsActivity: { game: undefined } });

    this.handleNext(event, id);

    this.forceUpdate();
  }

  handleRereadingSubmit(event, id) {
    this.setState({ rereadingBooks : event.split(";") });
  }

  handleWordBankWordsSubmit(event, id) {
    var activity = this.state.wordBankActivity;
    activity.numNewWords = event.length;
    activity.wordList = [];
    event.map(function(word) {
      activity.wordList.push(word.text);
    });
    var length = activity.wordList.length;
    for (var i = 0; i < 8 - length && i < this.props.student.highFrequencyWords.length; i++) {
      activity.wordList.push(this.props.student.highFrequencyWords[i]);
    }
    this.setState({ wordBankActivity: activity });
    this.setState({ updatedWordList: true });
    this.forceUpdate();
  }

  handleWordBankSubmit(event, id, otherJustSelected) {
    var activity = this.state.wordBankActivity;
    if (otherJustSelected) {
      activity.game = undefined
      this.setState({ wordBankActivity: activity });
      return;
    }

    var activityName = event.target.target ? event.target.target : event.target.value.trim()
    switch (activityName) {
      case 'Bingo':
      activity.game = Constants.BingoNum;
      break;
      case 'Memory':
      activity.game = Constants.MemoryNum;
      break;
      case 'Letter Tiles':
      activity.game = Constants.LetterTilesWordBankNum;
      break;
      default:
      activity.game = Constants.OtherWordBankNum;
      activity.otherDescription = activityName;
      break;
    }
    this.setState({ wordBankActivity: activity });
    this.handleNext(event, id);
  }

  handleWordBankActivityWordsSubmit(event, id) {
    var activity = this.state.wordBankActivity;
    activity.wordList = event == null ? [] : event.split(";");
    this.setState({ wordBankActivity: activity });
    this.setState({ updatedWordList: false });
    this.forceUpdate();
  }

  handleWordBankNotesSubmit(event, id) {
    var activity = this.state.wordBankActivity;
    activity.notes = event.target.value.trim();
    if (activity.notes == "") {
      activity.notes = "Remember to demonstrate the activity first for your child!";
    }
    this.setState({ wordBankActivity: activity });
    this.handleNext(event, id);
  }

  handlePhonicsSubmit(event, id, otherJustSelected) {
    var activity = this.state.phonicsActivity;
    if (otherJustSelected) {
      activity.game = undefined
      this.setState({ phonicsActivity: activity });
      return;
    }

    var activityName = event.target.target ? event.target.target : event.target.value.trim()
    activity.pattern1 = this.state.title;
    activity.pattern2 = "";
    switch (activityName) {
      case 'Rainbow Writing':
      activity.game = Constants.RainbowWritingNum;
      break;
      case 'Picture Sort':
      activity.game = Constants.PictureSortNum;
      var index = Constants.PhonicsPatterns.indexOf(activity.pattern1);
      if (index === 0) {
        index = 1;
      } else {
        index -= 1;
      }
      activity.pattern2 = Constants.PhonicsPatterns[index];
      break;
      case 'Letter Tiles':
      activity.game = Constants.LetterTilesPhonicsNum;
      break;
      default:
      activity.game = Constants.OtherPhonicsNum;
      activity.otherDescription = activityName;
      break;
    }
    this.setState({ phonicsActivity: activity });
    this.handleNext(event, id);
  }

  handlePhonicsNotesSubmit(event, id) {
    var activity = this.state.phonicsActivity;
    activity.notes = event.target.value.trim();
    if (activity.notes == "") {
      activity.notes = "Make sure your student knows the meaning of the words you discuss!";
    }
    this.setState({ phonicsActivity: activity });
    this.handleNext(event, id);
  }

  handleNewReadingSubmit(event, id) {
    this.setState({ brandNewReadingBook : event });
    this.handleNext(event, id);
  }

  handleCommunicationSubmit(event, id) {
    this.setState({ communicationActivity : { notes: event.target.value.trim() }});
    this.handleNext(event, id);
  }

  handleDateSubmit(event, id) {
    this.setState({ date : event.unix() });
    this.handleNext(event, id);
  }

  handleLessonPlanDone(event) {

    function isUndefined(x) {
      return typeof x == 'undefined';
    }

    function validate() {
      var errorString = "";

      // focus
      errorString += isUndefined(lessonPlan.title) ? "\t∙ Lesson Focus\n" : "";

      // word bank activity
      errorString += isUndefined(lessonPlan.wordBankActivity.game) && 
                      lessonPlan.wordBankActivity.otherDescription == "" 
                      ? "\t∙ Word Bank Activity\n" : ""
      
      // phonics activity
      errorString += isUndefined(lessonPlan.phonicsActivity.game) && 
                      lessonPlan.phonicsActivity.otherDescription == "" 
                      ? "\t∙ Phonics Activity\n" : ""
      
      errorString += isUndefined(lessonPlan.brandNewReadingBook) ? "\t∙ New Reading Book\n" : "";
      errorString += isUndefined(lessonPlan.communicationActivity) ? "\t∙ Communication Activity\n" : "";
      errorString += isUndefined(lessonPlan.date) ? "\t∙ Date\n" : "";

      if (errorString != "") {
        event.preventDefault();
        alert("The following were not completed:\n\n" + errorString);
        console.log("here")
        return false;
      }
      return true;
    }

    var lessonPlan = this.state;
    if (!validate()) {
      return;
    }

    if (lessonPlan.wordBankActivity.wordList.length == 0) {
      for (var i = 0; i < 8 && i < this.props.student.highFrequencyWords.length; i++) {
        lessonPlan.wordBankActivity.wordList.push(this.props.student.highFrequencyWords[i]);
      }
    }

    event.preventDefault();
    this.props.handleNewLessonPlan(lessonPlan);

    this.props.updateWizardKey();
  }

  render() {
    var focusOptions = ['Begin ' + Constants.PhonicsPatterns[this.props.student.currentPhonicsPattern]];
    if (this.props.student.currentPhonicsPattern > 0) {
      focusOptions.unshift('Review ' + Constants.PhonicsPatterns[this.props.student.currentPhonicsPattern - 1]);
    }
    focusOptions.push("Other");

    var bookOptions = [];
    if (this.props.student.readBooks !== "") {
      this.props.student.readBooks.map(function(name) {
        bookOptions.push({ value: name, label: name });
      });
    }

    var activity = this.state.wordBankActivity;

    var selected = []
    if (activity.wordList.length == 0) {
      for (var i = 0; i < 8 && i < this.props.student.highFrequencyWords.length; i++) {
        selected.push(this.props.student.highFrequencyWords[i]);
      }
    }
    var selectedWordBankWords = activity.wordList.length == 0 ? selected.join(";") : activity.wordList.join(";");
    

    var wordBankWordOptions = [];
    if (typeof activity.wordList !== "undefined") {
      var numNewWords = typeof activity.numNewWords == "undefined" ? 0 : activity.numNewWords;
      for (var i = 0; i < activity.wordList.length; i++) {
        if (i < numNewWords) {
          wordBankWordOptions.push({ value: activity.wordList[i], label: activity.wordList[i], clearableValue: false });
        } else {
          wordBankWordOptions.push({ value: activity.wordList[i], label: activity.wordList[i] });
        }
      }
    }
    this.props.student.highFrequencyWords.map(function(name) {
      wordBankWordOptions.push({ value: name, label: name });
    });

    var self = this;
    var newBookOptions = [];
    this.booksRef.once("value", function(data) {
      data.forEach(function(bookSnapshot) {
        var name = bookSnapshot.key();
        var book = bookSnapshot.val();
        var nameAndLabel = name + " (" + book.level + ")";
        if (book.patterns.includes(self.state.title)) {
          newBookOptions.push({ value: name, label: nameAndLabel });
        }
      });
      if (newBookOptions.length == 0) {
        data.forEach(function(bookSnapshot) {
        var name = bookSnapshot.key();
        var book = bookSnapshot.val();
        var nameAndLabel = name + " (" + book.level + ")";
        newBookOptions.push({ value: name, label: nameAndLabel });
      });
      }
    });

    var phonicsOptions = ['Letter Tiles', 'Other'];
    if (Constants.PhonicsPatterns.indexOf(this.state.title) <= 20) { // Emergent
      phonicsOptions = ['Rainbow Writing', 'Picture Sort', 'Other'];
    }

    var question0 = { index : 0, 
                      type : 'ChooseOne',
                      hasOptionalText : true,
                      text : "What would you like to focus on today?",
                      placeholder : "Enter what you will teach today here",
                      choices : focusOptions,
                      handleSubmit : this.handleFocusSubmit,
                      required: true
                    };
    var question1 = { index : 1, 
                      type : 'ChooseMultiple',
                      hasOptionalText : false,
                      text : "Which books would you like to reread?",
                      choices : bookOptions,
                      values: "",
                      wordBankQuestion: false,
                      handleSubmit : this.handleRereadingSubmit,
                      required: false
                    };
    var question2 = { index : 2,
                      type : 'List',
                      text : 'What new high frequency words will you introduce?',
                      handleSubmit : this.handleWordBankWordsSubmit,
                      required: false
                    };
    var question3 = { index : 3,
                      type : 'ChooseOne',
                      hasOptionalText : true,
                      text : 'What word bank activity would you like to do today?',
                      placeholder : 'Describe your activity here!',
                      choices : ['Bingo', 'Memory', 'Letter Tiles', 'Other'],
                      handleSubmit : this.handleWordBankSubmit,
                      required: true
                    };
    var question4 = { index : 4, 
                      type : 'ChooseMultiple',
                      hasOptionalText : false,
                      text : "Which words would you like to use for your word bank activity?",
                      choices : wordBankWordOptions,
                      values: selectedWordBankWords,
                      update: this.state.updatedWordList,
                      wordBankQuestion: true,
                      handleSubmit : this.handleWordBankActivityWordsSubmit,
                      required: true
                    };
    var question5 = { index : 5,
                      type : 'Text',
                      text : 'Any other notes for your word bank activity?',
                      placeholder : 'Make sure your student knows the meaning of the words you discuss!',
                      handleSubmit : this.handleWordBankNotesSubmit,
                      required: false
                    };
    var question6 = { index : 6,
                      type : 'ChooseOne',
                      hasOptionalText : true,
                      placeholder : 'Describe your activity here!',
                      text : 'What phonics activity would you like to do?',
                      choices : phonicsOptions,
                      handleSubmit : this.handlePhonicsSubmit,
                      required: true
                    };
    var question7 = { index : 7,
                      type : 'Text',
                      text : 'Any other notes for your phonics activity?',
                      placeholder : 'Remember to demonstrate the activity first for your child!',
                      handleSubmit : this.handlePhonicsNotesSubmit,
                      required: false
                    };
    var question8 = { index : 8,
                      type : 'Select',
                      hasOptionalText : false,
                      text : "What new book would you like to read?",
                      choices : newBookOptions,
                      handleSubmit : this.handleNewReadingSubmit,
                      required: true
                    };
    var question9 = { index : 9,
                      type : 'Text',
                      text : 'What would you like to write about today?',
                      placeholder : 'Write a story, a letter, or anything else you can think of!',
                      handleSubmit : this.handleCommunicationSubmit,
                      required: true
                    };
    var question10 = { index : 10,
                      type : 'Date',
                      text : 'What day is this lesson for?',
                      handleSubmit : this.handleDateSubmit,
                      required: true
                    };
    var questions = [question0, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10];

    // The Modal
    return(
      <div className="wizard">
        <span className="close pull-right">×</span>
        <div className="questions">
          <form className="form-horizontal" onSubmit={this.handleLessonPlanDone}>

            {questions.map(
              (function(question) {
                return <WizardQuestion key={question.index} question={question} choices={question.choices}/>;
              }).bind(this)
            )}
            <div className="form-group question" id={"question" + questions.length}>
              <button type="submit" className="btn btn-primary">Done!</button>
            </div>
          </form>
        </div>
        <div className="wizardGradient"> </div>
      </div>
    );
  }
}

export default WizardDetail;
