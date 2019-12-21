import React from "react";
// we need to connect our CoursesPage to the store
import { connect } from "react-redux";
// to update the store, we need to fire our action
import * as courseActions from "../../redux/actions/courseActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

class CoursesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: {
        title: ""
      }
    };
  }

  handleChange = event => {
    //make a copy of our current state
    const course = { ...this.state.course, title: event.target.value }; // we should always treat react state as mutable
    this.setState({
      course // object shorthand syntax
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    // dispatching an action to the store
    // if we just call an action creator, it won't to anything since it just returns an object
    // since we didn't declare mapDispatchToProps, connect automatically adds Dispatch as a prop
    // eslint is showing us warning since dispatch isn't declared as a prop type to our component
    // prop types helps us to specify the prop types that our component expects thus helping us cache error
    // thus import prop type at the top

    // call for method1
    // this.props.dispatch(courseActions.createCourse(this.state.course));

    // call from method 2
    //this.props.createCourse(this.state.course);
    // call method 3
    this.props.actions.createCourse(this.state.course);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Courses</h2>
        <h3>Add course</h3>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.course.title}
        />
        <input type="submit" value="Save" />
        {this.props.courses.map(course => (
          <div key={course.title}>{course.title}</div>
        ))}
      </form>
    );
  }
}

// setting th prop-types
CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  // dispatch: PropTypes.func.isRequired
  // createCourse: PropTypes.func.isRequired
  actions: PropTypes.object.isRequired
};

// this function determines what part of the state we expose to our components via props
function mapStateToProps(state) {
  console.log(state);
  return {
    // Be careful, request only specific data that ur component  need
    courses: state.courses
  };
}

// connect our components to redux
// container components
// Takes two arguements, mapStateToProps, mapDispatchToProps
// connect returns a function, tht function then calls our component
// mapDispatchToProps is an optional component, when we ignore it
// our component gets a dispatch prop automatically

//export default connect(mapStateToProps)(CoursesPage);

// same as
// const connectedStateAndProps = connect(mapStateToProps, mapDispatchToProps);
// export default connectedStateAndProps(CoursePage);

// method 2
// allows us to specifify what actions we want to expose to this component
function mapDispatchToProps(dispatch) {
  return {
    // handling actions method 2
    // createCourse: course => dispatch(courseActions.createCourse(course))
    // above is still verbose thus the need for method 3
    actions: bindActionCreators(courseActions, dispatch)
  };
}
// Since we declared mapDispatchToProps, dispatch is no longer injected.
// Only actions we declared in mapDispatchToProps are passed in.
export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
