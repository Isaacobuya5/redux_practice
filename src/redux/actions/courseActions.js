import * as types from "./actionTypes";
import * as courseApi from "../../api/courseApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

export function loadCourseSuccess(courses) {
  return { type: types.LOAD_COURSES_SUCCESS, courses };
}

export function createCourseSuccess(course) {
  return { type: types.CREATE_COURSE_SUCCESS, course };
}

export function updateCourseSuccess(course) {
  return { type: types.UPDATE_COURSE_SUCCESS, course };
}

export function deleteCourseOptimistic(course) {
  return {
    type: types.DELETE_COURSE_OPTIMISTIC,
    course
  };
}

export function loadCourses() {
  return function(dispatch) {
    // adding this for beginApiCll
    dispatch(beginApiCall());
    return courseApi
      .getCourses()
      .then(courses => {
        dispatch(loadCourseSuccess(courses));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function saveCourse(course) {
  return function(dispatch) {
    // adding this for beginApiCll
    dispatch(beginApiCall());
    return courseApi
      .saveCourse(course)
      .then(savedCourse => {
        // update an existing course or add new course based on existance of course id
        course.id
          ? dispatch(updateCourseSuccess(savedCourse))
          : dispatch(createCourseSuccess(course));
      })
      .catch(error => {
        // Redux isn't being notified that the API is completed if the API fails
        // need to fix that - dispatch action when API call fails
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

// Thunk for Optimistic Delete
// Differences with the thunks above
// a. Immediately dispatching deleteCount
// b. Not dispatching beginApiCall
export function deleteCourse(course) {
  return function(dispatch) {
    // Doing optimistic delete so not dispatching begin/end api call
    // actions or apiCallError action since we are not showing the loading status for this.
    dispatch(deleteCourseOptimistic(course));
    return courseApi.deleteCourse(course.id);
  };
}
