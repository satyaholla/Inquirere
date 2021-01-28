import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import Quiz from '../../../../../shared/Quiz';
import { get, post } from '../../../utilities';
import User from '../../../../../shared/User';
import QuizCard from './QuizCard';

type Props = {
  userId: string;
  profileUserId?: string;
}

type State = {
  quizzes: Quiz[],
  profileUser: User,
}

class ProfilePage extends Component<Props & RouteComponentProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      profileUser: undefined,
    }
  }

  async componentDidMount() {
    try {
      const newQuizzes: Quiz[] = await get('/api/userquizzes', {userId: this.props.profileUserId});
      const newUser: User = await get('/api/user', {userId: this.props.profileUserId})
      this.setState({
        profileUser: newUser,
        quizzes: newQuizzes,
      });
    } catch (err) {
      console.log(`ProfilePage Error: ${err.message}`)
    }
  }

  handleDelete = (quizId: string): void => {
    console.log('first');
    console.log(this.state.quizzes);
    post('/api/deletequiz', { quizId: quizId })
    .then(quiz => {
      console.log('second');
      const newQuizzes: Quiz[] = [...this.state.quizzes];
      console.log(this.state.quizzes);
      for (let i = 0; i < newQuizzes.length; i++) {
        if (newQuizzes[i]._id === quizId) {
          newQuizzes.splice(i, 1);
          break;
        }
      }
      this.setState({
        quizzes: newQuizzes,
      });
    })
    .catch((err) => {console.log('bruh moment')});
  }

  render() {
    if (!this.state.profileUser) {
      return <p>Loading!</p>;
    } else if (!this.props.userId) {
      return <p>Please log in to view profiles.</p>
    }

    if (this.state.quizzes.length === 0) {
      return <p>{`Sorry, ${this.state.profileUser.name}, you don't have any quizzes. Go to Create Quiz to make one!`}</p>
    }
    return (
      <>
        <h3>Hello there! Here are the quizzes for user {this.state.profileUser.name}</h3>
        <ul>
          {this.state.quizzes.map(quiz => <QuizCard quiz = {quiz} handleDelete = {this.handleDelete} renderDelete = {this.props.userId === this.props.profileUserId}/>)}
        </ul>
      </>
    );
  }
}

export default ProfilePage;