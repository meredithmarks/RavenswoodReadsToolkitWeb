import React from 'react';
import LessonPlanSidebarCell from './LessonPlanSidebarCell.jsx';

class LessonsSidebarComponent extends React.Component {

  render() {
    var planned = [];
    var completed = [];
    // var firstPlanned = undefined;
    // var firstCompleted = undefined;
    this.props.plans.map(
      (function(plan) {
        if (plan.completed) {
        //   if (typeof firstPlanned == undefined) {
        //     firstPlanned = plan;
        //   }
          completed.push(plan);
        } else {
        //   if (typeof firstCompleted == undefined) {
        //     firstCompleted = plan;
        //   }
          planned.push(plan);
        }
      })
    );

    if (false) { // TODO: put this back in if possible
      var seeMoreButton = <div className="see-more-button"> <span className="glyphicon glyphicon-menu-down"></span> </div>;
    }
    
    if (this.props.plans.length > 0) {
    	return <div className="sidebarInner">

      <row>
        { seeMoreButton }
        <div className="header-cell"> Planned </div>
      </row>
      {planned.map(
        (function(plan) {
          return <LessonPlanSidebarCell key={plan['.key']} selected={this.props.selectedPlan===plan} lessonPlan={plan} handleClick={this.props.handleClick} handleDelete={this.props.handleDelete} className="LessonPlanSidebarCell"/>;
        }).bind(this)
      )}

      <row>
        { seeMoreButton }
        <div className="header-cell"> Completed </div>
      </row>
      {completed.map(
        (function(plan) {
          return <LessonPlanSidebarCell key={plan['.key']} selected={this.props.selectedPlan===plan} lessonPlan={plan} handleClick={this.props.handleClick} className="LessonPlanSidebarCell"/>;
        }).bind(this)
      )}


      </div>;
    } else {
      return <div id="no-plans-found"> No lesson plans found! </div>
    }

  }
}

export default LessonsSidebarComponent;
