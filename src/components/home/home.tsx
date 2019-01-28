import * as React from 'react';
import './home.css';
import { Link } from 'react-router-dom';



export class Home extends React.Component {
    render() {
        return  <div id="online" className="hidden">
                    <Link className="button" to="/host">Host Room</Link>
                    <Link className="button" to="/client">Join Room</Link>
                </div>;
    }
}
