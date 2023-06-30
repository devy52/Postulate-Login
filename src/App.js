import React from "react";
import Index from "./pages/index";
import Page404 from "./pages/page404";
import Signup from "./pages/signup";
import Home from "./pages/home";
import FP from "./pages/fp";
import Cards from "./pages/postlist";
import Make from "./pages/post";
import Reset from './pages/resetpass';
import Pass from "./pages/pass";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
    }
`;

const App = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <GlobalStyles />
      <Switch>
      <Route
          path="/index"
          render={() => (isLoggedIn ? <Redirect to="/fp" /> : <Home />)}
        />
        <Route
          path="/index"
          render={() => (isLoggedIn ? <Redirect to="/fp" /> : <Index />)}
        />
        <Route
          path="/signup"
          render={() => (isLoggedIn ? <Redirect to="/fp" /> : <Signup />)}
        />
        <Route path="/reset" component={Reset} />
        <Route exact path="/reset" component={Reset} />
        <Route path="/reset/:token" component={() => <Pass />} />
        <Route
          path="/fp"
          render={() =>
            isLoggedIn ? <FP /> : <Redirect to="/index" />
          }
        />
        <Route
          path="/cards"
          render={() =>
            isLoggedIn ? <Cards /> : <Redirect to="/index" />
          }
        />
        <Route
          path="/make"
          render={() =>
            isLoggedIn ? <Make /> : <Redirect to="/index" />
          }
        />
        <Route component={Page404} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
