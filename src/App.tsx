import React from "react";
import "./App.css";
import Dashboard from "./Dashboard/Dashboard";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";

const App = () => {
  const routes = [
    {
      path: "/dashboard",
      component: Dashboard,
      exact: false
    }
  ];

  const renderRoutes = () => {
    const routeComponents = routes.map(({ path, component, exact }, key) => (
      <Route path={path} component={component} exact={exact} key={key} />
    ));
    return <Switch>{routeComponents}</Switch>;
  };

  return (
    <div className="App">
      <BrowserRouter>
        {renderRoutes()}
        {/* <Redirect to={"/dashboard"} /> */}
      </BrowserRouter>
    </div>
  );
};

export default App;
