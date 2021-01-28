import { Schema, Document, model} from "mongoose";

const QuestionSchema = new Schema({
  title: String,
  answers: [String],
  positions: [[Number]]
});

export interface Question {
  title: string;
  answers: string[];
  positions: number[][];
  _id?: string;
}

export {QuestionSchema};