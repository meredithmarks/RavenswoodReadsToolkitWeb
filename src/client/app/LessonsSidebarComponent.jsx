import React from 'react';
import LessonPlanSidebarCell from './LessonPlanSidebarCell.jsx';

class LessonsSidebarComponent extends React.Component {

  constructor(props) {
  	super(props);

  	this.state = {

  	}
  }

  render () {

    var rows = [];
    for (var i=0; i < 10; i++) {
        rows.push(<row> <LessonPlanSidebarCell key={i} id={i} className="LessonPlanSidebarCell"/> </row>);
    }
  	return <div className="sidebarInner">{rows}</div>;
  }
}

export default LessonsSidebarComponent;