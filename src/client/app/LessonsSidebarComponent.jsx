import React from 'react';
import LessonPlanSidebarCell from './LessonPlanSidebarCell.jsx';

class LessonsSidebarComponent extends React.Component {

  render() {
    var planned = [];
    var completed = [];
    this.props.plans.map(
      (function(plan) {
        if (plan.completed) {
          completed.push(plan);
        } else {
          planned.push(plan);
        }
      })
    );

    if (this.props.plans.length > 0) {
    	return <div className="sidebarInner">

      <row>
        <div className="see-more-button"> <span className="glyphicon glyphicon-menu-down"></span> </div>
        <div className="header-cell"> Planned </div>
      </row>
      {planned.map(
        (function(plan) {
          return <row> <LessonPlanSidebarCell key={plan['.key']} selected={this.props.selectedPlan===plan} lessonPlan={plan} handleClick={this.props.handleClick} handleDelete={this.props.handleDelete} className="LessonPlanSidebarCell"/> </row>;
        }).bind(this)
      )}

      <row>
        <div className="see-more-button"> <span className="glyphicon glyphicon-menu-down"></span> </div>
        <div className="header-cell"> Completed </div>
      </row>
      {completed.map(
        (function(plan) {
          return <row> <LessonPlanSidebarCell key={plan['.key']} selected={this.props.selectedPlan===plan} lessonPlan={plan} handleClick={this.props.handleClick} handleDelete={this.props.handleDelete} className="LessonPlanSidebarCell"/> </row>;
        }).bind(this)
      )}


      </div>;
    } else {
      return <row> No lesson plans found! </row>
    }

  }
}

export default LessonsSidebarComponent;
