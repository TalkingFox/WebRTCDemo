import { HashRouter, Route } from 'react-router-dom';
import React = require('react');
import ReactDOM = require('react-dom');
import { RouterBase } from './components/router-base';

ReactDOM.render(
    <HashRouter>
        <RouterBase></RouterBase>
    </HashRouter>,
    document.getElementById('root')
);
