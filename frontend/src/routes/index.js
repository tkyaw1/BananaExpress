import React from 'react'
import { Route} from 'react-router'

import Home from '../containers/home'
import Journal from '../containers/journal'
import Insights from '../containers/insights'
import EntryListView from '../components/EntryListView'

/* containers */
const routes = [
    {
    path: '/',
    exact: true,
    sidebar: () => <div>Home</div>,
    main: () => <Home/>
    },
    {
    path: '/journal/:id',
    exact: false,
    sidebar: () => <div>Journal</div>,
    main: () => <Journal/>
    },
    {
    path: '/journal',
    exact: true,
    sidebar: () => <div>List</div>,
    main: () => <EntryListView/>
    },
    {
    path: '/insights',
    exact: true,
    sidebar: () => <div>Insights</div>,
    main: () => <Insights/>
    }
]

const Routes = () => {
    return (
        <div id="ScrollContainer">
            <div className="App-content">
                {routes.map((route, index) => (
                    <Route
                        history={this.props}
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
