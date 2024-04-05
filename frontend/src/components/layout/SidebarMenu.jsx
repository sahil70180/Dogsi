import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarMenu = ({menuItems}) => {

  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

  const handleMenuItemClick = (menitemUrl) => {
    setActiveMenuItem(menitemUrl);
  }
  return (
    <div className="list-group mt-5 pl-4">
      {menuItems?.map((menuitem, index) => (
        <Link
          key={index}
          to={menuitem.url}
          className={`fw-bold list-group-item list-group-item-action ${activeMenuItem.includes(menuitem.url) ? "active" : ""}`}
          onClick={() => handleMenuItemClick(menuitem.url)}
          //setting up current element using aria-current
          aria-current = {activeMenuItem.includes(menuitem.url) ? "true" : "false"}
        >
          <i className={`${menuitem.icon} fa-fw pe-2`}></i> {menuitem.name}
        </Link>
      ))}
    </div>
  );
};

export default SidebarMenu;
