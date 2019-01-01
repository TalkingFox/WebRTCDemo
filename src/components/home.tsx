import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import { Host } from './host';
import { Client } from './client';

export class Home extends React.Component {
    render() {
        return  <div id="online" className="hidden">
                    <Link className="button" to="/host">Host Room</Link>
                    <Link className="button" to="/client">Join Room</Link>
                </div>;
    }
}
