import React, {Suspense, lazy} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {BuilderPage} from "./pages/BuilderPage";
import {MyPage} from "./pages/MyPage";
import {DashboardPage} from "./pages/DashboardPage";

import SpeakerCreate from "./pages/speaker/Create";
import Speakers from "./pages/speaker/List";

import Events from "./pages/event/List";
import EventCreate from "./pages/event/Create";
import EventEdit from "./pages/event/Edit";

import UserCreate from "./pages/user/Create";
import UserEdit from "./pages/user/Edit";
import Users from "./pages/user/List";

import Approvals from "./pages/approval/List";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

export default function BasePage() {
    // useEffect(() => {
    //   console.log('Base page');
    // }, []) // [] - is required if you need only one call
    // https://reactjs.org/docs/hooks-reference.html#useeffect

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/dashboard"/>
                }
                <ContentRoute path="/dashboard" component={DashboardPage}/>
                {/* Speaker Routes */}
                <ContentRoute exact path="/speaker/create" component={SpeakerCreate}/>
                <ContentRoute path="/speakers" component={Speakers}/>

                <ContentRoute exact path="/events" component={Events}/>
                <ContentRoute exact path="/event/create" component={EventCreate}/>
                <ContentRoute exact path="/event/:id" component={EventEdit}/>

                <ContentRoute exact path="/user/create" component={UserCreate}/>
                <ContentRoute eaxct path="/user/:id" component={UserEdit}/>
                <ContentRoute exact path="/users" component={Users}/>

                <ContentRoute path="/approvals" component={Approvals}/>

                <ContentRoute path="/builder" component={BuilderPage}/>
                <ContentRoute path="/my-page" component={MyPage}/>
                <Route path="/google-material" component={GoogleMaterialPage}/>
                <Route path="/react-bootstrap" component={ReactBootstrapPage}/>
                <Route path="/e-commerce" component={ECommercePage}/>
                <Redirect to="error/error-v1"/>
            </Switch>
        </Suspense>
    );
}
