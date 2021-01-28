// component that allows you to input the title of the question

import React, { Component } from 'react';
import nc from '../../../../../shared/NamedConstants';

type Props = {
    defaultText: string,
    questionDataAnswers: string[],
    questionDataPositions: number[][],
    categoryData: string[],
    qNumber: number,
    aNumber: number,
    handleAnswersChange: (event: React.ChangeEvent<HTMLInputElement>, qNumber: number, aNumber: number) => void,
    handlePositionChange: (event: React.ChangeEvent<HTMLInputElement>, qNumber: number, aNumber: number, cNumber: number) => void,
}

class InputAnswerChoices extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = 'u-flex'>
                <label>Answer Choice {this.props.aNumber + 1}:    </label>
                <input
                    type = 'text'
                    placeholder = {this.props.defaultText}
                    value = {this.props.questionDataAnswers[this.props.aNumber]}
                    onChange = {(event: React.ChangeEvent<HTMLInputElement>): void => {
                        return this.props.handleAnswersChange(event, this.props.qNumber, this.props.aNumber);
                    }}
                />
                <div className = 'u-flexColumn'>
                    {this.props.categoryData.map((cat: string, cNumber: number): JSX.Element => (
                        <div className = 'u-flex'>
                            <p>{cat}</p>
                            <input
                                type = 'range'
                                value = {this.props.questionDataPositions[this.props.aNumber][cNumber].toString()}
                                max = {nc.SLIDER_MAX.toString()}
                                min = {nc.SLIDER_MIN.toString()}
                                onChange = {(event: React.ChangeEvent<HTMLInputElement>): void => {
                                    this.props.handlePositionChange(event, this.props.qNumber, this.props.aNumber, cNumber);
                                }}
                            />
                        </div>
                    ))}
                </div>
                <br/>
            </div>
        );
    }
}

export default InputAnswerChoices;