import React, { Component } from 'react';
import { Router  } from '@reach/router';
import { get, post } from '../utilities'
import NotFound from './pages/Misc/NotFound';
import LoginPage from './pages/Misc/LoginPage';
import CreateQuiz from './pages/CreateQuiz/CreateQuiz';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import QuizPage from './pages/QuizPage/QuizPage';
import NavBar from '../components/NavBar';
import LogoutBar from './LogoutBar';
import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { socket } from '../client-socket';
import User from '../../../shared/User';
import "../utilities.css";

type State = {
  userId: string,
}

class App extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    }
  }

  componentDidMount() {
    get('/api/whoami').then((user: User) => {
      if (user._id) {
        // TRhey are registed in the database and currently logged in.
        this.setState({userId: user._id})
      }
    }).then(() => socket.on("connect", () => {
      post("/api/initsocket", { socketid: socket.id });
    }));
  }

  isGoogleLoginResponse = (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ): res is GoogleLoginResponse => {
    return !!res && typeof res === "object" && !!(res as GoogleLoginResponse).tokenObj;
  };

  handleLogin = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (!this.isGoogleLoginResponse(res)) {
      console.log("You are offline!");
      return;
    }
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user: User) => {
      this.setState({ userId: user._id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    // NOTE:
    // All the pages need to have the props defined in RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.

    if (!this.state.userId) {
      return <LoginPage handleLogin={this.handleLogin}/>;
    }

    return (
      <>
        <LogoutBar handleLogout = {this.handleLogout} />
        <NavBar userId = {this.state.userId}/>

        <Router>
          <ExplorePage path = '/' />
          <CreateQuiz path="/create" userId = {this.state.userId}/>
          <QuizPage path = '/quiz/:quizId' userId = {this.state.userId}/>
          <ProfilePage path = '/profile/:profileUserId' userId = {this.state.userId}/>
          <NotFound default/>
        </Router>
      </>
    )
  }
}

export default App;
