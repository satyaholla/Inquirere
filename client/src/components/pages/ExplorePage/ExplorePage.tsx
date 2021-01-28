import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import Quiz from '../../../../../shared/Quiz';
import { get, post } from '../../../utilities';

type Props = {
}

type State = {
}

class ExplorePage extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p>Also in the works!</p>
        );
    }
}

export default ExplorePage;