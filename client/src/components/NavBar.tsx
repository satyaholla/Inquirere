import React, { Component } from 'react';
import { Link } from '@reach/router';
type Props = {
    userId: string,
}

type State = {}

class NavBar extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className = 'u-flex u-spaceEvenly bar'>
                <Link className="u-link" to={`/profile/${this.props.userId}`}>
                    Profile      
                </Link>
                <Link className="u-link" to="/create">
                    Create a Quiz!     
                </Link>
                <Link className="u-link" to="/">
                    Explore
                </Link>
                

            </nav>
        );
    }
}

export default NavBar;
