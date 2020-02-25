import React, { Fragment } from "react";
import Navbar from "./Navbar/Navbar";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./Home/Home";
import Styles from "./Dashboard.module.scss";
import Models from "./Models/Models";
import ModelDetails from "./ModelDetails/ModelDetails";
import Content from "./Content/Content";

const Dashboard = () => {
  const routes = [
    {
      path: "/dashboard/models",
      component: Models,
      exact: true
    },
    {
      path: "/dashboard/models/:id",
      component: ModelDetails,
      exact: false
    },
    {
      path: "/dashboard/content/:id",
      component: Content,
      exact: false
    },
    {
      path: "/",
      component: Home,
      exact: false
    }
  ];

  const renderChildRoutes = () => {
    return routes.map(({ path, component, exact }, key) => {
      return (
        <Route path={path} component={component} exact={exact} key={key} />
      );
    });
  };

  return (
    <Fragment>
      <div>
        <Navbar></Navbar>
      </div>
      <div className={Styles.container}>
        <Switch>{renderChildRoutes()}</Switch>
        {/* <Redirect to={`/login`} /> */}
      </div>
    </Fragment>
  );
};

export default Dashboard;
