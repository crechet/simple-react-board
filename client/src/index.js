import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import reducers from './reducers';

// Import styles.
import './styles/styles.css';

// Components.
import Root from './components/root';

// Create Application store.
const store = createStore(
    reducers,
    {},
    applyMiddleware(reduxThunk)
);

const node = <Provider store={store}>
    <BrowserRouter>
        <Switch>
            <Route path="/" component={Root} />
        </Switch>
    </BrowserRouter>
</Provider>;

const target = document.getElementById('rrt-root');

ReactDOM.render(node, target);
