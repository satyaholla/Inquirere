import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import GoogleLogin, {  GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login';

import "./Login.css";
//TODO(weblab student): REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "1069618540025-j0mmu098u8d0s57nvtpsr1fcvahvdvld.apps.googleusercontent.com";

type Props = {
    handleLogin: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
}

type State = {
    loggedIn: boolean;
}

class LoginPage extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        }
    }

    render() {
        return (
            <div>
            <div className="open">
            <>
                <h1 className="welcome">Login with Google:   </h1>
                <div className= "login">
                <GoogleLogin 
                    clientId={GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={this.props.handleLogin}
                    onFailure={(err) => console.log(err)}

                />
                </div>
            </>
            </div>
            </div>
        );
    }
}

export default LoginPage;