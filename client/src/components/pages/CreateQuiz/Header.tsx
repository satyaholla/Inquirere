// component that allows you to input the title of the question

import React, { Component } from 'react';

type Props = {
    defaultText: string,
    questionDataTitle: string,
    qNumber: number,
    handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>, qNumber: number) => void,
    deleteQuestion: (index: number) => void,
}


class Header extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <br/><br/>
                <label>Question {this.props.qNumber + 1}:</label>
                <button
                    onClick = {() => this.props.deleteQuestion(this.props.qNumber)}
                >
                Delete Question
                </button><br/>
                
                <label>Question Title</label>
                <input
                    type = 'text'
                    value = {this.props.questionDataTitle}
                    placeholder = {this.props.defaultText}
                    onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
                        return this.props.handleTitleChange(event, this.props.qNumber);
                    }}
                />
            </>
        );
    }
}

export default Header;