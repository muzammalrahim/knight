/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {Link, Switch, Redirect} from "react-router-dom";
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";
import {ContentRoute} from "../../../../_metronic/layout"
import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";

export function AuthPage() {
  return (
      <>
        <div className="d-flex flex-column flex-root">
          {/*begin::Login*/}
          <div
              className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
              id="kt_login"
          >
            {/*begin::Aside*/}
            <div
                className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
                style={{
                  backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-4.jpg")})`
                }}
            >
              {/*begin: Aside Container*/}
              <div className="d-flex flex-row-fluid flex-column justify-content-between">
                {/* start:: Aside header */}
                <Link to="/" className="flex-column-auto mt-5">
                  <img
                      alt="Logo"
                      className="max-h-70px"
                      src={toAbsoluteUrl("/media/logos/logo-letter-1.png")}
                  />
                </Link>
                {/* end:: Aside header */}

                {/* start:: Aside content */}
                <div className="flex-column-fluid d-flex flex-column justify-content-center">
                  <h3 className="font-size-h1 mb-5 text-white">
                    Welcome to Knight!
                  </h3>
                  <p className="font-weight-lighter text-white opacity-80">
                    The ultimate Bootstrap & React 16 admin theme framework for next
                    generation web apps.
                  </p>
                </div>
                {/* end:: Aside content */}

              </div>
              {/*end: Aside Container*/}
            </div>
            {/*begin::Aside*/}

            {/*begin::Content*/}
            <div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden">
              {/*begin::Content header*/}
             
              {/*end::Content header*/}

              {/* begin::Content body */}
              <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
                <Switch>
                <ContentRoute path="/auth/login" component={Login}/>
                <ContentRoute path="/auth/registration" component={Registration}/>
                <ContentRoute
                    path="/auth/forgot-password"
                    component={ForgotPassword}
                />

                <ContentRoute
                    path="/auth/reset-password/:id"
                    component={ResetPassword}
                />
               

                <Redirect from="/auth" exact={true} to="/auth/login"/>
                <Redirect to="/auth/login"/>
              </Switch>
              </div>
              {/*end::Content body*/}

            </div>
            {/*end::Content*/}
          </div>
          {/*end::Login*/}
        </div>
      </>
  );
}
