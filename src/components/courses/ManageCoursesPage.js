import React, { useEffect } from "react";
// we need to connect our CoursesPage to the store
import { connect } from "react-redux";
// to update the store, we need to fire our action
import { loadCourses } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorAction";
import PropTypes from "prop-types";

function ManageCoursesPage({ courses, authors, loadAuthors, loadCourses }) {
  // useEffect, same as componentDidMount for classes
  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("Loading courses failed " + error);
      });
    }

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("Loading authors failed " + error);
      });
    }
  }, []);
  // Declaring empty array as a second arguement to effect means the effect will run once when the component mounts

  return (
    <>
      <h2>Manage Course</h2>
    </>
  );
}

// setting th prop-types
ManageCoursesPage.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired
};

// this function determines what part of the state we expose to our components via props
function mapStateToProps(state) {
  return {
    // Be careful, request only specific data that ur component  need
    courses: state.courses,
    authors: state.authors
  };
}

// declaring mapDispatchToProps as an object rather than as a function
const mapDispatchToProps = {
  //   loadCourses: courseActions.loadCourses, -> we have changed import to named
  loadCourses,
  loadAuthors
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursesPage);
