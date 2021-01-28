import React, { Component } from 'react';

type Props = {
    categories: string[],
    addCategory: () => void,
    deleteCategory: (cNumber: number) => void,
    handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>, cNumber: number) => void,
}

class InputAnswerChoices extends Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            
            <div>
                <p>Add Categories here!</p>
                <br/><br/>
                {this.props.categories.map((cat, i) => (<>
                    <input
                        type = 'text'
                        value = {cat}
                        placeholder = 'New Category Here'
                        onChange = {(event: React.ChangeEvent<HTMLInputElement>) => {
                            this.props.handleCategoryChange(event, i);
                        }}
                    />
                    <button
                        onClick = {() => this.props.deleteCategory(i)}
                    >
                    X
                    </button>
                    <br/></>
                ))}

                <button
                    onClick = {this.props.addCategory}
                >
                    New Category
                </button>
            </div>
        );
    }
}

export default InputAnswerChoices;