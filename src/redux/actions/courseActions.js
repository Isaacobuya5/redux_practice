// stores all our course related actions
// an action creator returns an action object
export function createCourse(course) {
  return {
    type: "CREATE_COURSE",
    course
  };
}
