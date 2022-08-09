import React, { useReducer, createContext } from "react";
import decode from "jwt-decode";

const initialState = {
  user: null,
};

// if (localStorage.getItem("token")) {
//   const decodedToken = decode(localStorage.getItem("token"));

//   if (decodedToken.exp * 1000 < Date.now()) {
//     localStorage.removeItem("token");
//   } else {
//     initialState.user = decodedToken;
//   }
// }

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData) => {
    localStorage.setItem("token", userData.token); // is being saved to localStorage, but then removed upon page refresh
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    window.location.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
