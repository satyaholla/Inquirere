// component to let you input the name of the quiz

import React, { Component } from 'react';

type Props = {
    defaultText: string,
    nameValue: string,
    handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

type State  = {}

class InputName extends Component<Props, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <label>Quiz Title:   </label>
                <input
                    type = 'text'
                    placeholder = {this.props.defaultText}
                    value = {this.props.nameValue}
                    onChange = {this.props.handleNameChange}
                />
            </>
        );
    }
}

export default InputName;