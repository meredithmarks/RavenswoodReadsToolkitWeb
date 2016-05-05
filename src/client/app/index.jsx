import React from 'react';
import {render} from 'react-dom';
import Firebase from 'firebase';
import LessonPlanSidebarCell from './LessonPlanSidebarCell.jsx';
import LessonsSidebarComponent from './LessonsSidebarComponent.jsx';
import LessonPlanDetail from './LessonPlanDetail.jsx';
import ReactFireMixin from 'reactfire';

const App = React.createClass({

  mixins: [ReactFireMixin],

  componentWillMount: function() {
    var ref = new Firebase("https://rrtoolkit.firebaseio.com/students/Lucas/lessonPlans/");
    this.bindAsArray(ref.limitToFirst(100), "lessonPlans");
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
    this.firebaseRefs["lessonPlans"].authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        self.setState(self.state);
        console.log("Authenticated successfully with payload:", authData);
      }
    }, {
      scope: "email"
    });
  },

  handleSignOut(event) {
    this.firebaseRefs["lessonPlans"].unauth();
    this.setState(this.state);
  },

  render() {
    this.state.lessonPlans.sort(function(a, b) { return  b['.key'] - a['.key']; });
  	var renderPlan = function(plan) {
  		if (plan) {
  			return <LessonPlanDetail plan={plan} />;
  		} else {
  			return "Click to see a lesson plan!";
  		}
  	};
    var authData = this.firebaseRefs["lessonPlans"].getAuth();
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      return  (
      <div>
        <table className="topbar">
        <tbody>
          <tr>
            <td width="300px"> <img id="current-child-picture" src="./public/BabyLucas.jpg" /><span id="current-child-name">Lucas T. <span className="glyphicon glyphicon-menu-down"></span></span><span id="logout-button" onClick={this.handleSignOut}>Logout</span></td>
            <td className="header-title"> Ravenswood Reads Lesson Planner </td>
            <td width="250px"><div className="create-button pull-right"> + </div></td>
          </tr>
        </tbody>
        </table>

        <div id="sidebar">
          <LessonsSidebarComponent handleClick={this.setSelectedPlan} handleDelete={this.deleteLessonPlan} selectedPlan={this.state.selectedPlan} plans={this.state.lessonPlans} />
        </div>
        <div id="content">
          {renderPlan(this.state.selectedPlan)}
        </div>
      </div>
      );
    } else {
      console.log("User is logged out");
      return (
        <div>
          <div id="login-title"> Ravenswood Reads Toolkit </div>
          <div type="button" id="login-button" className="btn btn-primary btn-lg" onClick={this.handleSignIn}>Sign In with Google</div>
        </div>
      );
    }
  }
});

render(<App/>, document.getElementById('app'));
