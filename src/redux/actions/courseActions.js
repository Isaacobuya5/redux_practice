import * as types from "./actionTypes";
import * as courseApi from "../../api/courseApi";

export function loadCourseSuccess(courses) {
  return { type: types.LOAD_COURSES_SUCCESS, courses };
}

export function createCourseSuccess(course) {
  return { type: types.CREATE_COURSE_SUCCESS, course };
}

export function updateCourseSuccess(course) {
  return { type: types.UPDATE_COURSE_SUCCESS, course };
}

export function loadCourses() {
  return function(dispatch) {
    return courseApi
      .getCourses()
      .then(courses => {
        dispatch(loadCourseSuccess(courses));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function saveCourse(course) {
  return function(dispatch) {
    return courseApi
      .saveCourse(course)
      .then(savedCourse => {
        // update an existing course or add new course based on existance of course id
        course.id
          ? dispatch(updateCourseSuccess(savedCourse))
          : dispatch(createCourseSuccess(course));
      })
      .catch(error => {
        throw error;
      });
  };
}
