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
    this.bindAsArray(ref, "lessonPlans");
  },

  setSelectedPlan: function(plan) {
  	this.setState({selectedPlan: plan});
  },

  render() {
  	var renderPlan = function(plan) {
  		if (plan) {
  			return <LessonPlanDetail plan={plan} />;
  		} else {
  			return "Nothing here!";
  		}
  	};
    return  (
    	<div>
		    <div id="topbar">
		    	<h3 className="pull-left"> Ravenswood Reads Lesson Planner </h3>
		    	<button className="createButton pull-right"> + </button>
		    </div>

		    <div id="sidebar">
		    	<LessonsSidebarComponent handleClick={this.setSelectedPlan} plans={this.state.lessonPlans} />
		    </div>
		    <div id="content">
		    	{renderPlan(this.state.selectedPlan)}
		    </div>
		</div>
    );
  }
});

render(<App/>, document.getElementById('app'));
