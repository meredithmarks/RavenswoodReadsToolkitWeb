import React from 'react';
import Constants from './constants';
import Select from 'react-select';
import { Button, ButtonGroup } from 'react-bootstrap';


class AddStudentForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {currentPhonicsPattern: NaN, readBooks: "", name: "", grade: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.gradeChange = this.gradeChange.bind(this);
    this.phonicsPatternChange = this.phonicsPatternChange.bind(this);
    this.hfwChange = this.hfwChange.bind(this);
    this.readBooksChange = this.readBooksChange.bind(this);

    var self = this;
    this.phonicsOptions = [];
    Constants.PhonicsPatterns.map(function(pattern, index) {
      self.phonicsOptions.push({ value: ""+index, label: pattern });
    });

    this.bookOptions = [];
    var booksRef = new Firebase("https://rrtoolkit.firebaseio.com/books");
    booksRef.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var name = childSnapshot.key();
        self.bookOptions.push({ value: name, label: name });
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    var student = this.state;
    if (student.name == "" || student.grade == "" || isNaN(student.currentPhonicsPattern)) {
      alert("Name, grade, and current phonics pattern are required!");
      return false;
    }
    student.readBooks = student.readBooks.split(';');
    this.props.addStudent(student);
    return false;
  }

  nameChange(event) {
    this.setState({ name: event.target.value });
  }

  gradeChange(event) {
    event.preventDefault();
    this.setState({ grade: event.target.target });
  }

  phonicsPatternChange(value) {
    this.setState({ currentPhonicsPattern: parseInt(value) });
  }

  hfwChange(event) {
    this.setState({ highFrequencyWords: event.target.value.split(" ").join("").split(",") });
  }

  readBooksChange(value) {
    this.setState({ readBooks: value });
  }

  render() {

    return (
      <div id="add-student">
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="form-group">

          <label className="control-label col-sm-4" htmlFor="name">Student name:</label>
          <div className="col-sm-8">
            <input type="text" className="form-control" id="name" onChange={this.nameChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-4" htmlFor="grade">Student grade:</label>
          <div className="btn-group col-sm-8" data-toggle="buttons">
          <ButtonGroup>
            <Button target="K" onClick={this.gradeChange} active={this.state.grade === "K"}>K</Button>
            <Button target="1st" onClick={this.gradeChange} active={this.state.grade === "1st"}>1st</Button>
            <Button target="2nd" onClick={this.gradeChange} active={this.state.grade === "2nd"}>2nd</Button>
            <Button target="3rd" onClick={this.gradeChange} active={this.state.grade === "3rd"}>3rd</Button>
          </ButtonGroup>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-4" htmlFor="phonics-pattern">Current phonics pattern:</label>
          <div className="col-sm-8">
            <Select
                name="phonics-pattern"
                value={"" + this.state.currentPhonicsPattern}
                options={this.phonicsOptions}
                simpleValue={true}
                onChange={this.phonicsPatternChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-4" htmlFor="name">Enter any high-frequency words (comma-separated):</label>
          <div className="col-sm-8">
            <input type="text" className="form-control" id="name" onChange={this.hfwChange} placeholder="ex. this, that"/>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-4" htmlFor="books">Pick any read books:</label>
          <div className="col-sm-8">
            <Select
                name="books"
                value={this.state.readBooks}
                multi={true}
                options={this.bookOptions}
                simpleValue={true}
                delimiter=";"
                onChange={this.readBooksChange}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-4 col-sm-8">
            <button type="submit" className="btn btn-primary">Add Student</button>
          </div>
        </div>
      </form>
      </div>
    );


  }

}

export default AddStudentForm;