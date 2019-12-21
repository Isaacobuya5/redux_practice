import React from "react";
// we need to connect our CoursesPage to the store
import { connect } from "react-redux";
// to update the store, we need to fire our action
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorAction";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";
// handling redirects with react router
import { Redirect } from "react-router-dom";

class CoursesPage extends React.Component {
  state = {
    redirectToAddCoursePage: false
  };
  componentDidMount() {
    const { courses, authors } = this.props;
    if (courses.length === 0) {
      this.props.actions.loadCourses().catch(error => {
        alert("Loading courses failed " + error);
      });
    }

    if (authors.length === 0) {
      this.props.actions.loadAuthors().catch(error => {
        alert("Loading authors failed " + error);
      });
    }
  }
  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses</h2>
        {/* adding the button for adding course */}
        <button
          style={{ marginBottom: 20 }}
          className="btn btn-primary add-course"
          onClick={() => this.setState({ redirectToAddCoursePage: true })}
        >
          Add Course
        </button>
        <CourseList courses={this.props.courses} />
      </>
    );
  }
}

// setting th prop-types
CoursesPage.propTypes = {
  authors: PropTypes.array.isRequired,
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
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map(course => {
            return {
              ...course,
              authorName: state.authors.find(a => a.id === course.authorId).name
            };
          }),
    authors: state.authors
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
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch)
    }
  };
}
// Since we declared mapDispatchToProps, dispatch is no longer injected.
// Only actions we declared in mapDispatchToProps are passed in.
export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
