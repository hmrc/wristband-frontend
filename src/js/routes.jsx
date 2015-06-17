import React from 'react/addons';
import Router from 'react-router';
const { DefaultRoute, Route, NotFoundRoute } = Router;

import App from './app.jsx';

export default (
    <Route path="/" handler={App}/>
);
