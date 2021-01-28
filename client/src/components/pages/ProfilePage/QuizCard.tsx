import React, { Component } from 'react';
import Quiz from '../../../../../shared/Quiz';
import {Link} from '@reach/router';

type Props = {
    quiz: Quiz,
    handleDelete: (quizId: string) => void,
    renderDelete: boolean,
}

class QuizCard extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className = 'u-flex'>
                <Link className = 'u-link' to={`/quiz/${this.props.quiz._id}`}>
                    <h4>{this.props.quiz.name}</h4>
                </Link>
                <button onClick = {() => this.props.handleDelete(this.props.quiz._id)}>X</button>
            </li>
        );
    }
}

export default QuizCard;