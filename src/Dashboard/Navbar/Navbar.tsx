import React from "react";
import { useHistory } from "react-router-dom";
import Styles from "./Navbar.module.scss";

const Navbar = () => {
  const history = useHistory();
  const NavItems = [
    { label: "Home", path: "/dashboard" },
    { label: "Models", path: "/dashboard/models" },
    { label: "Media", path: "media" }
  ];

  const redirectTo = route => {
    history.push(route.path);
  };

  return (
    <div className={Styles.navbar}>
      <div className={Styles.logo}></div>
      <div className={Styles.navItems}>
        {NavItems.map(item => {
          return (
            <span className={Styles.navItem} onClick={() => redirectTo(item)}>
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
