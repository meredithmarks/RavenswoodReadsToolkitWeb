import React from 'react';

class LessonPlanSidebarCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {plan : props.lessonPlan};
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  _timestampToDate(timestamp) {
    var a = new Date(timestamp * 1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();

    return month + ' ' + date + ', ' + year;
  }

  handleClick(event) {
    this.props.handleClick(this.state.plan);
  }

  handleDelete(event) {
    event.stopPropagation();
    this.props.handleDelete(this.state.plan['.key']);
  }

  render() {
    var classnames = "lesson-plan-sidebar-cell"
    if (this.props.selected) classnames += ' selected';
    return (
        <div className={classnames} onClick={this.handleClick}>
          <div className="delete-plan-button" onClick={this.handleDelete}> &times; </div>
          <div className="sidebar-lesson-plan-date"> {this._timestampToDate(this.state.plan.date)} </div>
          <div className="sidebar-lesson-plan-title"> {this.state.plan.title} </div>
        </div>
    );
  }

}

export default LessonPlanSidebarCell;
