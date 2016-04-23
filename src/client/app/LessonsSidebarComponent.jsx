import React from 'react';
import LessonPlanSidebarCell from './LessonPlanSidebarCell.jsx';

class LessonsSidebarComponent extends React.Component {

  render() {

  	return <div className="sidebarInner">{this.props.plans.map(
      (function(plan) {
        return <row> <LessonPlanSidebarCell key={plan} lessonPlan={plan} handleClick={this.props.handleClick} className="LessonPlanSidebarCell"/> </row>;
      }).bind(this)
    )}</div>;

  }
}

export default LessonsSidebarComponent;
