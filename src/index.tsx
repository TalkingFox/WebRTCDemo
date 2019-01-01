import { HashRouter } from 'react-router-dom';
import React = require('react');
import ReactDOM = require('react-dom');
import { Home } from './components/home';

ReactDOM.render(
    <HashRouter>
        <Home></Home>
    </HashRouter>,
    document.getElementById('root')
);
