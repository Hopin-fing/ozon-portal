import React from 'react'
import 'materialize-css'
import {useRoutes} from "./routes";
import {BrowserRouter as Router} from "react-router-dom"
import {AuthContext} from './context/AuthContext'
import {useAuth} from "./hooks/auth.hook";

function App() {
    const {token, login, logout, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

  return (
      <AuthContext.Provider value={{
          token, login, logout, userId, isAuthenticated
      }}>
          <Router>
            <div className="had-container">
                {routes}
            </div>
          </Router>
      </AuthContext.Provider>
  );
}

export default App;
