import { Schema, model, Document } from "mongoose";

const QuizResponseSchema = new Schema({
    quizId: String,
    answers: [Number],
    userId: String
});

interface QuizResponseDocument extends Document {
    quizId: string;
    answers: number[];
    userId: string;
    _id: string;
}

export interface QuizResponse {
    quizId: string;
    answers: number[];
    userId: string;
    _id?: string;
}

const QuizResponseModel = model<QuizResponseDocument>("QuizResponse", QuizResponseSchema);

export default QuizResponseModel;