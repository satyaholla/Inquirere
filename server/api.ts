import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import QuizModel from './models/Quiz';
import Quiz from '../shared/Quiz';
import QuizResponse from '../shared/QuizResponse';
import QuizResponseModel from './models/QuizResponse';
import UserModel from "./models/User";
import User from '../shared/User';
import nc from '../shared/NamedConstants';

const router = express.Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  }
  res.send({});
});

// HELPER FUNCTIONS
const isGoodQuiz = (quiz: Quiz): boolean => {
  try {
    let isGood: boolean = true;

    if (quiz.categories.length > nc.CATEGORY_MAX ||
        quiz.categories.length < nc.CATEGORY_MIN ||
        quiz.questions.length > nc.QUESTION_MAX ||
        quiz.questions.length < nc.QUESTION_MIN ||
        quiz.name === '') {
      isGood = false;
    }

    quiz.categories.forEach(str => {
      str === ''? isGood = false: null
    });

    quiz.questions.forEach(q => {
      if (q.title === '' ||
          q.answers.length !== nc.NUM_ANSWERCHOICES ||
          q.positions.length !== nc.NUM_ANSWERCHOICES) {
        isGood = false;
      }

      q.answers.forEach(a => {
        a === ''? isGood = false: null
      });

      q.positions.forEach(pArray => {
        pArray.length !== quiz.categories.length? isGood = false: null;

        pArray.forEach(val => {
          val < nc.SLIDER_MIN || val > nc.SLIDER_MAX? isGood = false: null;
        })
      });
    });

    return isGood;
  }

  catch { return false; }
}

const wipeQuiz = (quiz: Quiz): void => {
  quiz.categories = [];
  quiz.questions.forEach(q => {q.positions = []});
}

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.post('/newquiz', auth.ensureLoggedIn, (req, res) => {
  const quizValue = <Quiz>(req.body.quiz);
  quizValue.userId = (<User>req.user)._id;

  if (!isGoodQuiz(quizValue)) {
    res.status(400).send({ err: 'Bad Quiz' });
    return;
  }
  
  const newQuiz = new QuizModel(quizValue);
  newQuiz.save().then(quiz => res.send(quiz));
});


//get all quizzes made by userId
router.get('/userquizzes', auth.ensureLoggedIn, (req, res) => {
  const amOwner = (req.query.userId === (<User>req.user)._id);
  QuizModel.find({userId: <string>(req.query.userId)})
  .then((quizzes: any) => {
    const smallQuizzes: Quiz[] = quizzes.map((quizDoc: any) => {
      const smallQuiz: Quiz = <Quiz>(quizDoc);
      if (!amOwner) {
        wipeQuiz(smallQuiz);
      }
      return smallQuiz;
    });
    console.log(smallQuizzes);
    res.send(smallQuizzes);
  })
  .catch(() => console.log('oopsie'))
});

//get user by userId
router.get('/user', auth.ensureLoggedIn, (req, res) => {
  UserModel.findById(<string>(req.query.userId)).then((user: any) => {
    res.send(<User>(user));
  });
});

//get quiz by quizId
router.get('/quiz', auth.ensureLoggedIn, (req, res) => {
  QuizModel.findOne({_id: <string>req.query.quizId}).then((quiz: any) => {
    wipeQuiz(<Quiz>quiz);
    res.send(<Quiz>quiz);
  });
});

router.post('/quizresponse', auth.ensureLoggedIn, (req, res) => {
  const responseValue = <QuizResponse>(req.body.qr);
  const newResponse = new QuizResponseModel(responseValue);
  newResponse.save().then(r => res.send(r));
});

router.post('/deletequiz', auth.ensureLoggedIn, async (req, res) => {
  const quiz: Quiz = await QuizModel.findById(req.body.quizId);
  if ((<User>req.user)._id !== quiz.userId) {
    res.status(401).send({ err: 'You can\'t do that ahahahhh' });
    return;
  }
  else {
    QuizModel.deleteOne({ _id: req.body.quizId })
    .then((quiz: any) => res.send(<Quiz>quiz))
    .then(() => QuizResponseModel.deleteMany( { quizId: req.body.quizId }))
    .catch(console.log(':((('));
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
