import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import Quiz from '../../../../../shared/Quiz';
import QuizAskedQuestion from './QuizAskedQuestion';
import QuizResponse from '../../../../../shared/QuizResponse';
import { get, post } from '../../../utilities';
import { Link, Redirect } from '@reach/router';
import User from '../../../../../shared/User';

type Props = {
    userId: string;
    quizId?: string;
}

type State = {
    quiz: Quiz;
    quizCreator: User;
    answers: number[];
    submitted: boolean;
    redirect: boolean;
}

class QuizPage extends Component<Props & RouteComponentProps, State> {
  constructor(props) {
      super(props);
      this.state = {
          quiz: undefined,
          quizCreator: undefined,
          answers: [],
          submitted: false,
          redirect: false,
      };
  }

  async componentDidMount() {
      try {
        const thisQuiz: Quiz = await get('/api/quiz', { quizId: this.props.quizId});
        const thisCreator: User = await get('/api/user', {userId: thisQuiz.userId});
        this.setState({
            quiz: thisQuiz,
            quizCreator: thisCreator,
        });
      } 
      catch (err) {
          console.log(`QuizPage Error: ${err.message}`)
      }

      for (let i = 0; i < this.state.quiz.questions.length; i++) {
        this.state.answers.push(null);
      }
  }

  handleNewAnswer = (qNumber: number, aNumber: number): void => {
      const newAnswers: number[] = [...this.state.answers];
      newAnswers[qNumber] = aNumber;
      this.setState({
          answers: newAnswers,
      });
  }

  handleSubmit = (): void => {
      const newResponse: QuizResponse = {
          quizId: this.props.quizId,
          answers: this.state.answers,
          userId: this.props.userId,
      };
      
      post('/api/quizresponse', { qr: newResponse })
      .then(quiz => this.setState({
          submitted: true,
      }))
      .catch(err => console.log(err));
  }

  redirectPage = (): void => {
      this.setState({
          redirect: true,
      });
  }

  render() {
      if (!this.state.quiz || !this.state.quizCreator) {
          return <p>Loading!</p>;
      }

      else if (this.state.submitted) {
          return (
            <>
                {this.state.redirect? <Redirect to = {`/profile/${this.props.userId}`} />: null}
                <p>Thank you for submitting!</p>
                <button
                    onClick = {this.redirectPage}
                >
                    Back to Profile
                </button>
            </>
          );
      }

      return (
          <>
            <h1>{this.state.quiz.name}</h1>

            <Link to={`/profile/${this.state.quizCreator._id}`}>
                <h3>Creator: {this.state.quizCreator.name}</h3>
            </Link>

            {this.state.quiz.questions.map((q, i) => (
                <QuizAskedQuestion clicked = {this.state.answers[i]} qNumber = {i} question = {q} handleAnswer = {this.handleNewAnswer}/>
            ))}

            <button onClick = {this.handleSubmit}>Submit</button>
          </>
      );
  }
}

export default QuizPage;