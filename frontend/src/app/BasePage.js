import React, {Suspense, lazy} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {BuilderPage} from "./pages/BuilderPage";
import {MyPage} from "./pages/MyPage";
import {DashboardPage} from "./pages/DashboardPage";

import SpeakerCreate from "./pages/speaker/create";
import Speakers from "./pages/speaker/list";

import EventCreate from "./pages/event/create";
import Events from "./pages/event/list";

import UserCreate from "./pages/user/create";
import Users from "./pages/user/list";

import Approvals from "./pages/approval/list";

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

                <ContentRoute path="/event/create" component={EventCreate}/>
                <ContentRoute path="/events" component={Events}/>

                <ContentRoute path="/user/create" component={UserCreate}/>
                <ContentRoute path="/users" component={Users}/>

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
