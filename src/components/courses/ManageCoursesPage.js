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
import Spinner from "../common/Spinner";
// toast is the method we will call to display toas
import { toast } from "react-toastify";

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
  // add another state
  const [saving, setSaving] = useState(false);
  // useEffect, same as componentDidMount for classes
  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("Loading courses failed " + error);
      });
    } else {
      // copies a new course passed in on props to state any time a new course is passed in
      setCourse({ ...otherProps.course });
    }

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("Loading authors failed " + error);
      });
    }
  }, [otherProps.course]);
  // Declaring empty array as a second arguement to effect means the effect will run once when the component mounts
  // we want it to run any time any a new course is passed in on props
  function handleChange(event) {
    const { name, value } = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === "authorId" ? parseInt(value, 10) : value
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    saveCourse(course)
      .then(() => {
        toast.success("Course Saved");
        history.push("/courses");
      })
      .catch(error => {
        // incase of an error re-enable the save button to allow user to try again
        setSaving(false);
        setErrors({ onSave: error.message });
      });
    // This is passed in on props, so it is already bound to dispatch
  }

  return authors.length === 0 || courses.length === 0 ? (
    <Spinner />
  ) : (
    <CourseForm
      course={course}
      errors={errors}
      authors={authors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
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

// get a particular course based on slug
// This function is normally called a selector -> because it selcts data from the redux store
export function getCourseBySlug(courses, slug) {
  return courses.find(course => course.slug === slug) || null;
}

// this function determines what part of the state we expose to our components via props

// NOTE -> We need a way to add exising form items to a form field when we need to edit
// second mapToState properties called ownProps is needed for this
// we can use this to read the URL data injected on props by React Router
function mapStateToProps(state, ownProps) {
  const slug = ownProps.match.params.slug;
  // Next -> goal is now to populate the course object based on the URL or empty course otherwise
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse;
  return {
    // pass the newCourse we got above on props
    course,
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
