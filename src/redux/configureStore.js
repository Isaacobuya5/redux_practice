import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import reduxImutableStateInvariant from "redux-immutable-state-invariant";

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // Adds support for redux devTools

  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(reduxImutableStateInvariant()))
  );
}
// Redux middleware is a way to enhance Redux behaviour
// we first need to import applyMiddleware
// an example of middleware we use here is reduxImutableStateInvariant
// will warn us if we accidentaly mutate any state in redux store
// configure redux, devtools
// import compose
