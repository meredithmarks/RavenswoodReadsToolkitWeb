import React from 'react';

class LessonPlanSidebarCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {plan : props.lessonPlan};
    this.handleClick = this.handleClick.bind(this);
  }

  _timestampToDate(timestamp) {
    var a = new Date(timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();

    return month + ' ' + date + ', ' + year;
  }

  handleClick(event) {
    this.props.handleClick(this.state.plan)
  }

  render() {
    return (
        <div className="LessonPlanSidebarCell" onClick={this.handleClick}>
          <strong className="pull-left"> {this.state.plan.title} </strong>
          <div className="pull-right"> {this._timestampToDate(this.state.plan.date)} </div>
        </div>
    );
  }

}

export default LessonPlanSidebarCell;
