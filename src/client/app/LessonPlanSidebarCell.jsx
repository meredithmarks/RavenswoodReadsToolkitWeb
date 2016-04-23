import React from 'react';

class LessonPlanSidebarCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {likesCount : 0, id: props.id};
    this.onLike = this.onLike.bind(this);
  }

  onLike () {
    let newLikesCount = this.state.likesCount + 1;
    this.setState({likesCount: newLikesCount});
    console.log(this.state.id);
  }

  render() {
    return (
      // <div className="row"> 
        <div className="LessonPlanSidebarCell">
          <strong className="pull-left"> Wed, April 16 </strong>
          <div className="pull-right"> /A/ </div>
        </div>
      // </div>


      //   Likes : <span>{this.state.likesCount}</span>
      //   <div><button onClick={this.onLike}>Like Me</button></div>
    );
  }

}

export default LessonPlanSidebarCell;