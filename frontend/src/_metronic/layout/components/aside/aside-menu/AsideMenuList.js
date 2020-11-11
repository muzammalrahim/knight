/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl, checkIsActive} from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
        ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
        : "";
  };

  return (
      <>
        {/* begin::Menu Nav */}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {/*begin::1 Level*/}
          <li
              className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}/>
            </span>
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>

          <li className="menu-section ">
            <h4 className="menu-text">Speaker</h4>
            <i className="menu-icon flaticon-more-v2"></i>
          </li>
          <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/e-commerce", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/speaker">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Group.svg")}/>
            </span>
              <span className="menu-text">New Speaker</span>
            </NavLink>
          </li>

           <li className="menu-section ">
            <h4 className="menu-text">Events</h4>
            <i className="menu-icon flaticon-more-v2"></i>
          </li>
          <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/e-commerce", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/event">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}/>
            </span>
              <span className="menu-text">New Event</span>
            </NavLink>
          </li>

          <li className="menu-section ">
            <h4 className="menu-text">User</h4>
            <i className="menu-icon flaticon-more-v2"></i>
          </li>
          <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/e-commerce", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/user">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Add-user.svg")}/>
            </span>
              <span className="menu-text">Add User</span>
            </NavLink>
          </li>

          <li className="menu-section ">
            <h4 className="menu-text">Approvals</h4>
            <i className="menu-icon flaticon-more-v2"></i>
          </li>
          <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/e-commerce", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/approval">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Chat-check.svg")}/>
            </span>
              <span className="menu-text">List</span>
            </NavLink>
          </li>
        </ul>

        {/* end::Menu Nav */}
      </>
  );
}
