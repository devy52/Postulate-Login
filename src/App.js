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


const App = () => (
  <Router>
    <GlobalStyles />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/index" component={Index} />
      <Route path="/signup" component={Signup} />
      <Route path="/reset" component={Reset} />
      <Route exact path="/reset" component={Reset} />
      <Route path="/reset/:token" component={Pass} />
      <Route
        path="/fp"
        render={() =>
          localStorage.getItem('token') ? (
            <FP />
          ) : (
            <Redirect to="/index" />
          )
        }
      />
      <Route
        path="/cards"
        render={() =>
          localStorage.getItem('token') ? (
            <Cards />
          ) : (
            <Redirect to="/index" />
          )
        }
      />
      <Route
        path="/make"
        render={() =>
          localStorage.getItem('token') ? (
            <Make />
          ) : (
            <Redirect to="/index" />
          )
        }
      />
      <Route component={Page404} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

export default App;
