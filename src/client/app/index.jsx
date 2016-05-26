import React from 'react';
import {render} from 'react-dom';
import Firebase from 'firebase';
import LessonPlanSidebarCell from './LessonPlanSidebarCell.jsx';
import LessonsSidebarComponent from './LessonsSidebarComponent.jsx';
import LessonPlanDetail from './LessonPlanDetail.jsx';
import WizardDetail from './WizardDetail.jsx';
import WizardQuestion from './WizardQuestion.jsx';
import AddStudentForm from './AddStudentForm.jsx';
import ReactFireMixin from 'reactfire';
import {DropdownButton, MenuItem} from 'react-bootstrap';

const App = React.createClass({

  mixins: [ReactFireMixin],

  baseRef: new Firebase("https://rrtoolkit.firebaseio.com"),

  _checkIfUserExists: function(authData, self) {
    var usersRef = this.baseRef.child("users");
    usersRef.once("value", function(snapshot) {
      var userExists = snapshot.child(authData.uid).exists();
      if (userExists) {
        if (self.firebaseRefs["lessonPlans"]) { self.unbind("lessonPlans"); }
        if (self.firebaseRefs["student"]) { self.unbind("student"); }
        var student = snapshot.child(authData.uid).val();
        var studentRef = new Firebase("https://rrtoolkit.firebaseio.com/students/" + student + "/");
        self.bindAsObject(studentRef, "student");
        var ref = new Firebase("https://rrtoolkit.firebaseio.com/students/" + student + "/lessonPlans/");
        self.bindAsArray(ref, "lessonPlans");
        self.setState({ wizardKey: (new Date()).getTime() });
      } else {
        self.setState({ addingStudent: true })
      }
    });
  },

  componentWillMount: function() {
    var authData = this.baseRef.getAuth();
    if (!authData) { return; }
    this._checkIfUserExists(authData, this);
  },

  setSelectedPlan: function(plan) {
  	this.setState({selectedPlan: plan});
  },

  deleteLessonPlan: function(key) {
    this.firebaseRefs["lessonPlans"].child(key).remove();
    if (this.state.selectedPlan && this.state.selectedPlan['.key'] === key) {
    	this.setState({selectedPlan: undefined});
    }
  },

  handleSignIn(event) {
    var self = this;
    this.baseRef.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        self._checkIfUserExists(authData, self);
        console.log("Authenticated successfully with payload:", authData);
      }
    }, {
      scope: "email"
    });
  },

  handleSignOut(event) {
    this.baseRef.unauth();
    this.unbind("lessonPlans");
    this.unbind("student");
    this.setState(this.state);
  },

  addStudent(newStudent) {
    var authData = this.baseRef.getAuth();
    var usersRef = this.baseRef.child("users");
    var studentsRef = this.baseRef.child("students");
    var newStudentRef = studentsRef.push(newStudent);

    if (this.firebaseRefs["lessonPlans"]) { this.unbind("lessonPlans"); }
    if (this.firebaseRefs["student"]) { this.unbind("student"); }

    usersRef.child(authData.uid).set(newStudentRef.key());
    var studentRef = new Firebase("https://rrtoolkit.firebaseio.com/students/" + newStudentRef.key() + "/");
    this.bindAsObject(studentRef, "student");

    var ref = newStudentRef.child("lessonPlans");
    this.bindAsArray(ref, "lessonPlans");
    this.setState({addingStudent: false});
  },

  openNewPlan(event) {
    var wizard = document.getElementsByClassName("wizard-backdrop")[0];
    wizard.style.display = "block";
  },

  handleNewLessonPlan(newLessonPlan) {
    console.log(newLessonPlan);
    this.firebaseRefs["lessonPlans"].push(newLessonPlan);

    // this.firebaseRefs["lessonPlans"].push({
    //   "brandNewReadingBook" : "Story Time",
    //   "communicationActivity" : {
    //     "notes" : "Talk through the story again to ensure comprehension. Have Lucas write an alternate ending to the story!",
    //     "writingSample" : ""
    //   },
    //   "completed" : 1,
    //   "date" : 1.461735987216195E9,
    //   "notes" : "This was great, Lucas is great, everything is great!",
    //   "phonicsActivity" : {
    //     "game" : 4,
    //     "notes" : "I think Lucas will have a bit of trouble with this concept, so make sure to be clear and repeat yourself!",
    //     "otherDescription" : "",
    //     "pattern1" : "Dd /d/",
    //     "pattern2" : ""
    //   },
    //   "rereadingBooks" : [ "I Like to Count", "The Cat Came Back" ],
    //   "title" : "Dd /d/",
    //   "wordBankActivity" : {
    //     "game" : 1,
    //     "notes" : "I really want to make sure that Lucas gets all of these words today!",
    //     "numNewWords" : 2,
    //     "otherDescription" : "",
    //     "wordList" : [ "was", "you", "all", "one", "the" ]
    //   }
    // });

    var backdrop = document.getElementsByClassName("wizard-backdrop")[0];
    backdrop.style.display = "none";
  },



  render() {
    var self = this;
    if (!this.baseRef.getAuth()) {
      console.log("User is logged out");
      return (
        <div>
          <div id="login-title"> Ravenswood Reads Toolkit </div>
          <div type="button" id="login-button" className="btn btn-primary btn-lg" onClick={this.handleSignIn}>Sign In with Google</div>
        </div>
      );
    }
    if (!this.state) { // Render gets called before callback in componentWillMount returns
      return <div></div>
    }

    if (this.state.addingStudent) {
      return (
        <div>
          <table className="topbar">
            <tbody>
            <tr>
              <td width="100px">
                <DropdownButton title="Options" id="options-dropdown" noCaret={true}>
                  <MenuItem eventKey="1" onClick={this.handleSignOut}>Logout</MenuItem>
                </DropdownButton>
              </td>
            <td className="header-title"> Ravenswood Reads Lesson Planner </td>
            <td width="100px"></td>
            </tr>
            </tbody>
          </table>

          <AddStudentForm addStudent={this.addStudent} />
        </div>
      );
    }

    if (!this.state.student) { // Mother of god
      return <div></div>;
    }

    // logged in, has child
    this.state.lessonPlans.sort(function(a, b) { 
      if (a.date != b.date) {
        return b.date - a.date;
      }

      var aKey = a['.key'];
      var bKey = b['.key'];

      if (aKey < bKey) {
        return 1;
      } else if (aKey > bKey) {
        return -1;
      } else {
        return 0;
      }
    });

  	var renderPlan = function(plan) {
  		if (plan) {
        var updateWizardKey = function() {
          self.state.wizardKey = (new Date()).getTime;
        }
  			return <LessonPlanDetail plan={plan} student={self.state.student} studentRef={self.firebaseRefs["student"]} updateWizardKey={updateWizardKey}/>;
  		} else {
  			return <div></div>;
  		}
  	};
    var renderWizard = function() {

      var updateWizardKey = function() {
        self.state.wizardKey = (new Date()).getTime;
      }

      return <WizardDetail updateWizardKey={updateWizardKey} student={self.state.student} handleNewLessonPlan={self.handleNewLessonPlan}/>;
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      var backdrop = document.getElementsByClassName("wizard-backdrop")[0];
      var closeButton = document.getElementsByClassName("close")[0];
      var executeModal = document.getElementById('execute-modal');
      if (event.target == executeModal) {
          executeModal.style.display = "none";
      }
      if (event.target == backdrop || event.target == closeButton) {
          backdrop.style.display = "none";
      }
    }

    let dropdownTitle = <span>{this.state.student.name} <span className="glyphicon glyphicon-menu-down"></span></span>;
    return (
      <div>
        <table className="topbar">
        <tbody>
          <tr>
            <td width="300px"> <img id="current-child-picture" src="public/DefaultPicture.png" />
            <DropdownButton title={dropdownTitle} id="name-dropdown" noCaret={true}>
              <MenuItem eventKey="1" onClick={this.handleSignOut}>Logout</MenuItem>
            </DropdownButton>
            </td>
            <td className="header-title"> Ravenswood Reads Lesson Planner </td>
            <td width="250px"><div id="create-button" className="pull-right" onClick={this.openNewPlan}> + </div></td>
          </tr>
        </tbody>
        </table>

        <div id="sidebar">
          <LessonsSidebarComponent handleClick={this.setSelectedPlan} handleDelete={this.deleteLessonPlan} selectedPlan={this.state.selectedPlan} plans={this.state.lessonPlans} />
        </div>
        <div id="content">
          {renderPlan(this.state.selectedPlan)}
        </div>

        <div className="wizard-backdrop" key={self.state.wizardKey}>
          {renderWizard()}
        </div>

      </div>
    );
  }
});

render(<App/>, document.getElementById('app'));
