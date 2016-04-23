import React from 'react';
import {render} from 'react-dom';
import Firebase from 'firebase';
import LessonPlanSidebarCell from './LessonPlanSidebarCell.jsx';
import LessonsSidebarComponent from './LessonsSidebarComponent.jsx';

class App extends React.Component {
  constructor(props) {
  	super(props);

  	this.state = {

  	}

    this.firebaseRef = new Firebase("https://rrtoolkit.firebaseio.com/");
  }

  render () {
    return  (
    	<div>
		    <div id="topbar">
		    	<h3 className="pull-left"> Ravenswood Reads Lesson Planner </h3>
		    	<button className="createButton pull-right"> + </button>
		    </div>

		    <div id="sidebar">
		    	<LessonsSidebarComponent />
		    </div>

		    <div id="content">
		    	Hello world!
		    </div>
		</div>
    );
  }
}

render(<App/>, document.getElementById('app'));