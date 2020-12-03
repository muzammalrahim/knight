/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl, checkIsActive} from "../../../../_helpers";
export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const [user, setUser] = useState();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
        ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
        : "";
  };
  // useEffect(() => {
  //   let User = localStorage.getItem('persist:v705-demo1-auth') && JSON.parse(localStorage.getItem('persist:v705-demo1-auth')).user;
  //   User = JSON.parse(User)
  //   User && User.groups.length > 0 && setUser(User.groups[0])
  // },[]);
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

          <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/google-material", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Group.svg")}/>
            </span>
              <span className="menu-text">Speaker</span>
              <i className="menu-arrow"/>
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow"/>
              <ul className="menu-subnav">
                {/* Layout */}
                <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                        "/google-material/layout", true
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                >
                  <ul className="menu-subnav">
                      <li
                          className={`menu-item ${getMenuItemActive(
                              "/google-material/layout/box"
                          )}`}
                          aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/speakers">
                          <i className="menu-bullet menu-bullet-dot">
                            <span/>
                          </i>
                          <span className="menu-text">List</span>
                        </NavLink>
                      </li>
                      <li
                          className={`menu-item ${getMenuItemActive(
                              "/google-material/layout/box"
                          )}`}
                          aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/speaker/create">
                          <i className="menu-bullet menu-bullet-dot">
                            <span/>
                          </i>
                          <span className="menu-text">Create</span>
                        </NavLink>
                      </li>
                    </ul>
                </li>
              </ul>
            </div>
          </li>

          <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/google-material", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}/>
            </span>
              <span className="menu-text">Events</span>
              <i className="menu-arrow"/>
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow"/>
              <ul className="menu-subnav">
                {/* Layout */}
                <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                        "/google-material/layout", true
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                >
                  <ul className="menu-subnav">
                      <li
                          className={`menu-item ${getMenuItemActive(
                              "/google-material/layout/box"
                          )}`}
                          aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/events">
                          <i className="menu-bullet menu-bullet-dot">
                            <span/>
                          </i>
                          <span className="menu-text">List</span>
                        </NavLink>
                      </li>
                      <li
                          className={`menu-item ${getMenuItemActive(
                              "/google-material/layout/box"
                          )}`}
                          aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/event/create">
                          <i className="menu-bullet menu-bullet-dot">
                            <span/>
                          </i>
                          <span className="menu-text">Create</span>
                        </NavLink>
                      </li>
                    </ul>
                </li>
              </ul>
            </div>
          </li>
          {/* {user && user === 1 && */}
          <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/google-material", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Add-user.svg")}/>
            </span>
              <span className="menu-text">User</span>
              <i className="menu-arrow"/>
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow"/>
              <ul className="menu-subnav">
                {/* Layout */}
                <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                        "/google-material/layout", true
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                >
                  <ul className="menu-subnav">
                      <li
                          className={`menu-item ${getMenuItemActive(
                              "/google-material/layout/box"
                          )}`}
                          aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/users">
                          <i className="menu-bullet menu-bullet-dot">
                            <span/>
                          </i>
                          <span className="menu-text">List</span>
                        </NavLink>
                      </li>
                      <li
                          className={`menu-item ${getMenuItemActive(
                              "/google-material/layout/box"
                          )}`}
                          aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/user/create">
                          <i className="menu-bullet menu-bullet-dot">
                            <span/>
                          </i>
                          <span className="menu-text">Create</span>
                        </NavLink>
                      </li>
                    </ul>
                </li>
              </ul>
            </div>
          </li>
          {/* } */}
          <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/google-material", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Chat-check.svg")}/>
            </span>
              <span className="menu-text">Approvals</span>
              <i className="menu-arrow"/>
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow"/>
              <ul className="menu-subnav">
                {/* Layout */}
                <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(
                        "/google-material/layout", true
                    )}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                >
                  <ul className="menu-subnav">
                      <li
                          className={`menu-item ${getMenuItemActive(
                              "/google-material/layout/box"
                          )}`}
                          aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/approvals">
                          <i className="menu-bullet menu-bullet-dot">
                            <span/>
                          </i>
                          <span className="menu-text">List</span>
                        </NavLink>
                      </li>
                    </ul>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </>
  );
}
