import React, { Component } from 'react';
import Question from '../../../../../shared/Question';
import './QuizPage.css';

type Props = {
    question: Question;
    qNumber: number;
    clicked: number;
    handleAnswer: (qNumber: number, aNumber: number) => void;
}

class QuizAskedQuestion extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div>
                    <br/>
                    <h5>{this.props.question.title}</h5>
                    {this.props.question.answers.map((val, i) => (
                        <button
                            className = {this.props.clicked === i? 'QuizAskedQuestion-clickedButton': ''}
                            onClick = {() => 
                                this.props.handleAnswer(this.props.qNumber, i)
                            }
                            >
                            {val}
                        </button>
                    ))}
                </div>
            </>
        );
    }
}

export default QuizAskedQuestion;