import React from 'react'
import { Route} from 'react-router'

import Home from '../containers/home'

/* containers */
const routes = [
    {
    path: '/',
    exact: true,
    sidebar: () => <div>Home</div>,
    main: () => <Home/>
    }
]

const Routes = () => {
    return (
        <div id="ScrollContainer">
            <div className="App-content">
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.main}
                    />
                ))}
            </div>
        </div>
    );
}

export default Routes
