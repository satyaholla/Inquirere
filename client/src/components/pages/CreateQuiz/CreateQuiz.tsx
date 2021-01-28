import React, { Component } from 'react';
import { RouteComponentProps } from "@reach/router";
import QuizInputQuestion from './QuizInputQuestion';
import InputName from './InputName';
import InputCategories from './InputCategories';
import Question from '../../../../../shared/Question';
import Quiz from '../../../../../shared/Quiz';
import { get, post } from '../../../utilities';
import nc from '../../../../../shared/NamedConstants';

type Props = {
    userId: string;
}

type State = {
  questions: Question[],
  name: string,
  categories: string[],
  errors: boolean[],
  submitted: boolean,
}

const NUM_ERRORS: number = 5;

enum Error {
  emptyFieldError,
  categoryMinimumError,
  categoryMaximumError,
  questionMinimumError,
  questionMaximumError,
}

const ErrorMessages: string[] = [
  'You cannot leave any fields blank.',
  'There must be at least one category',
  'There can be at most 5 categories',
  'There must be at least one question',
  'There can be at most 15 questions.'
];

const populateArray = <U,>(outer: Array<any>, inner: Array<U>): Array<any> => {
  for (let i: number = 0; i < outer.length; i++) {
    outer[i] = [...inner];
  }
  return outer;
};

class CreateQuiz extends Component<Props & RouteComponentProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      questions: [{
        title: '',
        answers: new Array(nc.NUM_ANSWERCHOICES).fill(''),
        positions: populateArray(new Array(nc.NUM_ANSWERCHOICES), [0]),
      }],
      name: '',
      categories: [''],
      errors: new Array(NUM_ERRORS).fill(false),
      submitted: false,
    }
  }

  setErrorFlag = (errorType: Error): void => {
    this.setState(prevState => {
      const newErrors = new Array(NUM_ERRORS).fill(false);
      newErrors[errorType] = true;
      return {
        errors: newErrors,
      };
    });
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      name: event.target.value,
    });
  }

  //BUTTON METHODS  
  logState = (): void => {
    console.log(this.state);
  }
  
  handleSubmit = (): void => {
    let stateObj: State = this.state; // unload state to different object to prevent intermediate changes
    let submitFailed: boolean = false;
    if (this.state.name === '') {
      submitFailed = true;
    }
    for (let i: number = 0; i < stateObj.questions.length && !submitFailed; i++) {
      if (stateObj.questions[i].title === '') {
        submitFailed = true;
      }
      for (let j = 0; j < nc.NUM_ANSWERCHOICES; j++) {
        if (stateObj.questions[i].answers[j] === '') {
          submitFailed = true;
          break;
        }
      }
    }
    if (submitFailed) {
      this.setErrorFlag(Error.emptyFieldError);
      return;
    }
    const newQuiz: Quiz = {
      name: stateObj.name,
      userId: undefined,
      questions: stateObj.questions,
      categories: stateObj.categories,
    }

    post('/api/newquiz', {quiz: newQuiz})
    .then(quiz => {
      this.setState({
        name: '',
        questions: [{
          title: '',
          answers: new Array(nc.NUM_ANSWERCHOICES).fill(''),
          positions: new Array(nc.NUM_ANSWERCHOICES).fill([0])
        }],
        categories: [''],
        errors: new Array(NUM_ERRORS).fill(false),
        submitted: true,
      });
    })
    .catch(err => console.log('i knew this wouldn\'t work'));
  }

  //CATEGORY METHODS  
  addCategory = (): void => { // adds a grouping category
    if (this.state.categories.length >= nc.CATEGORY_MAX) {
      this.setErrorFlag(Error.categoryMaximumError);
      return;
    }

    this.setState(prevState => {
      const newQuestions: Question[] = prevState.questions;
      for (let i = 0; i < newQuestions.length; i++) {
        for (let j = 0; j < nc.NUM_ANSWERCHOICES; j++) {
          newQuestions[i].positions[j] = [...newQuestions[i].positions[j], 0];
        }
      }

      return {
        categories: [...prevState.categories, ''],
        questions: newQuestions,
      };
    });
  }

  deleteCategory = (cNumber: number): void => {
    if (this.state.categories.length <= nc.CATEGORY_MIN) {
      this.setErrorFlag(Error.categoryMinimumError)
      return;
    }

    this.setState(prevState => { 
      const newQuestions: Question[] = prevState.questions;
      const newCategories: string[] = prevState.categories;
      for (let i = 0; i < newQuestions.length; i++) {
        for (let j = 0; j < nc.NUM_ANSWERCHOICES; j++) {
          newQuestions[i].positions[j].splice(cNumber, 1);
        }
      }
      newCategories.splice(cNumber, 1);

      return {
        questions: newQuestions,
        categories: newCategories,
      };
    });
  }

  handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>, cNumber: number): void => {
    this.setState(prevState => {
      const newCategories = prevState.categories;
      newCategories[cNumber] = event.target.value;

      return {
        categories: newCategories,
      };
    });
  }

  //QUESTION METHODS 
  addQuestion = (): void => {
    if (this.state.questions.length >= nc.QUESTION_MAX) {
      this.setErrorFlag(Error.questionMaximumError);
      return;
    }

    this.setState(prevState => {
      const emptyQuestion: Question = {
        title: '',
        answers: new Array(nc.NUM_ANSWERCHOICES).fill(''),
        positions: new Array(nc.NUM_ANSWERCHOICES),
      }
      const emptyPositions = new Array(prevState.categories.length).fill(0);
      populateArray(emptyQuestion.positions, emptyPositions);

      return {
        questions: [...prevState.questions, emptyQuestion],
      };
    });
  }

  deleteQuestion = (qNumber: number): void => {
    if (this.state.questions.length <= nc.QUESTION_MIN) {
      this.setErrorFlag(Error.questionMinimumError);
      return;
    }

    this.setState(prevState => {
      const newQuestions: Question[] = prevState.questions;
      newQuestions.splice(qNumber, 1);

      return {
        questions: newQuestions,
      };
    });
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>, qNumber: number): void => {
    this.setState(prevState => {
      const newQuestions: Question[] = [...prevState.questions];
      newQuestions[qNumber].title = event.target.value;

      return {
        questions: newQuestions,
      };
    });
  }

  handleAnswersChange = (event: React.ChangeEvent<HTMLInputElement>, qNumber: number, aNumber: number): void => {
    this.setState(prevState => {
      const newQuestions: Question[] = [...prevState.questions];
      newQuestions[qNumber].answers[aNumber] = event.target.value;

      return {
        questions: newQuestions,
      };
    })
  }

  handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>, qNumber: number, aNumber: number, cNumber: number): void => {
    this.setState(prevState => {
      const newQuestions: Question[] = prevState.questions;
      newQuestions[qNumber].positions[aNumber][cNumber] = event.target.valueAsNumber;
      return {
        questions: newQuestions,
      };
    })
  }

  render() {
    if (this.state.submitted) {
      return (
        <>
          <p>Thank you for using Inquirere. Your quiz has successfully been saved.</p>
          <button
            onClick = {(): void => {
              this.setState({submitted: false})
            }}
          >
          New Quiz
          </button>
        </>
      );
    }


    const questionElems: JSX.Element[] = this.state.questions.map((q: Question, i: number): JSX.Element => {
      return (
        <QuizInputQuestion
          qNumber = {i}
          questionData = {this.state.questions[i]}
          categoryData = {this.state.categories}
          handleTitleChange = {this.handleTitleChange}
          handleAnswersChange = {this.handleAnswersChange}
          handlePositionChange = {this.handlePositionChange}
          deleteQuestion = {this.deleteQuestion}
        />
      );
    });

    return (
      <>
        <InputName
          defaultText = 'Enter Quiz Name'
          nameValue = {this.state.name}
          handleNameChange = {this.handleNameChange}
        />
        <InputCategories
          categories = {this.state.categories}
          handleCategoryChange = {this.handleCategoryChange}
          addCategory = {this.addCategory}
          deleteCategory = {this.deleteCategory}
        />
        
        {this.state.errors.map((errorState, i) => (errorState? (<p>{ErrorMessages[i]}</p>): null))}

        {this.state.questions.length === 0? <p>No Questions Yet!</p>: questionElems}
        <br/><br/><hr/>
        <button onClick = {this.logState}>Log State</button> {/*for debug purposes*/}
        <button onClick = {this.addQuestion}>New Question</button>
        <button onClick = {this.handleSubmit}>Submit</button>
      </>
    );
  }
}

export default CreateQuiz;