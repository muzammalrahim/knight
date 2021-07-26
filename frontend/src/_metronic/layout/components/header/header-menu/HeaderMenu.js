/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink} from "react-router-dom";
import { checkIsActive } from "../../../../_helpers";

export function HeaderMenu({ layoutProps }) {
 
    const location = useLocation();
    const getMenuItemActive = (url) => {
        return checkIsActive(location, url) ? "menu-item-active" : "";
    }

    return <div
        id="kt_header_menu"
        className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
        {...layoutProps.headerMenuAttributes}
    >
        {/*begin::Header Nav*/}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
            {/*begin::1 Level*/}
            <li className={`menu-item menu-item-rel ${getMenuItemActive('/dashboard')}`}>
                <NavLink className="" to="/dashboard">
              
              { location.pathname === "/speaker/create" ? <><p style={{fontSize:"2.5rem", margin:"auto",fontWeight: "bold"}}> <span style={{color:"#f8cd47"}}>`U</span><span style={{color:"#413939"}}>nited Medical</span></p> </>:
                    <img style={{height:"30px",width:"100px"}} src={process.env.PUBLIC_URL + './media/logos/knight_logo.png'} /> }
                </NavLink>
            </li>
            {/* <li className={`menu-item menu-item-rel ${getMenuItemActive('/dashboard')}`}>
                <NavLink className="menu-link" to="/dashboard">
                    <span className="menu-text">Dashboard</span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow" />)}
                </NavLink>
            </li> */}

        </ul>
        {/*end::Header Nav*/}
    </div>;
}
