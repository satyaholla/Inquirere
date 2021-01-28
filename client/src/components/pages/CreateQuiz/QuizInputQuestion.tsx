import React, { Component } from 'react';
import Question from '../../../../../shared/Question';
import Header from './Header';
import InputAnswerChoices from './InputAnswerChoices';
import nc from '../../../../../shared/NamedConstants';

type Props = {
    questionData: Question,
    qNumber: number,
    categoryData: string[],
    handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>, qNumber: number) => void,
    handleAnswersChange: (event: React.ChangeEvent<HTMLInputElement>, qNumber: number, aNumber: number) => void,
    handlePositionChange: (event: React.ChangeEvent<HTMLInputElement>, qNumber: number, aNumber: number, cNumber: number) => void,
    deleteQuestion: (qNumber: number) => void,
}

class QuizInputQuestion extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    render() { //TODO: use component for generic text input to create component for answer choice
        return (
            <>
                <Header
                    defaultText = 'Enter Question Here'
                    questionDataTitle = {this.props.questionData.title}
                    qNumber = {this.props.qNumber}
                    handleTitleChange = {this.props.handleTitleChange}
                    deleteQuestion = {this.props.deleteQuestion}
                />
                <br/> <br/>

                {Array(nc.NUM_ANSWERCHOICES).fill(0).map((val, i) => {
                    return (
                        <InputAnswerChoices
                            defaultText = {`Write Answer Choice ${i + 1}`}
                            questionDataAnswers = {this.props.questionData.answers}
                            questionDataPositions = {this.props.questionData.positions}
                            categoryData = {this.props.categoryData}
                            qNumber = {this.props.qNumber}
                            aNumber = {i}
                            handleAnswersChange = {this.props.handleAnswersChange}
                            handlePositionChange = {this.props.handlePositionChange}
                        />
                    );
                })}
            </>
        );
    }
}

export default QuizInputQuestion;