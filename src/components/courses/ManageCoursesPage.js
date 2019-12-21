import React, { useEffect, useState } from "react";
// we need to connect our CoursesPage to the store
import { connect } from "react-redux";
// to update the store, we need to fire our action
import { loadCourses, saveCourse } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorAction";
import PropTypes from "prop-types";
import CourseForm from "./CourseForm";
// we need an empty course structure to get us started
import { newCourse } from "../../tools/mockData";

// ...otherProps; rest operator allows us to assign any props i haven't destructured on the left to a variable called on otherProps
function ManageCoursesPage({
  courses,
  authors,
  loadAuthors,
  loadCourses,
  saveCourse,
  history,
  ...otherProps
}) {
  // form needs state to hold some form field values before they are saved
  const [course, setCourse] = useState({ ...otherProps.course });
  // initialize state for errors
  const [errors, setErrors] = useState({}); // initalize errors to an empty object

  // useEffect, same as componentDidMount for classes
  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("Loading courses failed " + error);
      });
    } else {
      setCourse({ ...otherProps.course });
    }

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("Loading authors failed " + error);
      });
    }
  }, [otherProps.course]);
  // Declaring empty array as a second arguement to effect means the effect will run once when the component mounts

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === "authorId" ? parseInt(value, 10) : value
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    saveCourse(course).then(() => {
      history.push("/courses");
    }); // This is passed in on props, so it is already bound to dispatch
  }

  return (
    <CourseForm
      course={course}
      errors={errors}
      authors={authors}
      onChange={handleChange}
      onSave={handleSave}
    />
  );
}

// setting th prop-types
ManageCoursesPage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

// this function determines what part of the state we expose to our components via props

function mapStateToProps(state) {
  return {
    // pass the newCourse we got above on props
    course: newCourse,
    courses: state.courses,
    authors: state.authors
  };
}

// declaring mapDispatchToProps as an object rather than as a function
const mapDispatchToProps = {
  //   loadCourses: courseActions.loadCourses, -> we have changed import to named
  loadCourses,
  loadAuthors,
  saveCourse
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursesPage);
