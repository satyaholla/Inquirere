import React, { Component } from 'react';
import { GoogleLogout } from 'react-google-login';

import "./Logout.css"

//TODO(weblab student): REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "1069618540025-j0mmu098u8d0s57nvtpsr1fcvahvdvld.apps.googleusercontent.com";

type Props = {
    handleLogout: () => void;
}

type State = {}

class LogoutBar extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className = 'u-flex u-spaceEvenly background'>
            <h1 className="title">Inquirere</h1>
            <GoogleLogout
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={this.props.handleLogout}
                onFailure={() => console.log(`Failed to logout.`)}
            />
        </div>
        );
    }
}

export default LogoutBar;