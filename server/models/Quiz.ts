import { Schema, model, Document } from "mongoose";
import {Question, QuestionSchema} from './Question';

const QuizSchema = new Schema({
  name: String,
  userId: String,
  questions: [QuestionSchema],
  categories: [String]
});

interface QuizDocument extends Document {
  name: string;
  userId: string;
  questions: Question[];
  categories: string[];
  _id: string;
}

export interface Quiz {
  name: string;
  userId: string
  questions: Question[];
  categories: string[];
  _id?: string;
}

const QuizModel = model<QuizDocument>("Quiz", QuizSchema);

export default QuizModel;