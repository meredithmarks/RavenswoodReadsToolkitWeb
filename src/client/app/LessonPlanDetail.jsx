import React from 'react';

class LessonPlanDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var plan = this.props.plan;
    console.log(plan);
    return (
        <div>
          <h2>{plan.title}</h2>
          <div>Books to re-read: {plan.rereadingBooks.join(", ")}</div>
        </div>
    );
  }

}

export default LessonPlanDetail;
