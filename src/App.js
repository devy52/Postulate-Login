import React from "react";
import Index from "./pages/index";
import Page404 from "./pages/page404";
import Signup from "./pages/signup";
import Home from "./pages/home";
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
      <Route path="/" exact component={Index} />
      <Route path="/index" component={Index} />
      <Route path="/signup" component={Signup} />
      <Route path="/home" component={Home} />
      <Route component={Page404} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

export default App;
