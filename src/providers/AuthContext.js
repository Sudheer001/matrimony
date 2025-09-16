import { createContext, useReducer, useContext } from "react";

// Initial state
let localData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const initialState = {
  user: localData,
  loading: false
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false };
    case "LOGIN_FAIL":
      return { user: null, loading: false };
    case "LOGOUT":
      return { user: null, loading: false };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook (easier usage)
export function useAuth() {
  return useContext(AuthContext);
}
