require("./App/config/auth.db");

const express = require("express");
const app = express();
const cors = require("cors");
const user = require("./App/config/User");
const Student = require("./App/config/Student");
const Teacher = require("./App/config/Teacher");
const LabelQuestion = require("./App/config/LabelQuestion");
const Question = require("./App/config/Question");
const Class = require("./App/config/Class");
const Quiz = require("./App/config/Quiz");
const GradingRoom = require("./App/config/GradingRoom");

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let check = await user.findOne({ email: req.body.email });
  if (check) {
    res.send({ notes: "Email telah tersedia" });
  } else {
    let User = new user(req.body);
    if (User.roles == "student") {
      let student = new Student(req.body);
      await User.save();
      let result = await student.save();
      res.send(result);
    } else if (User.roles == "teacher") {
      let teacher = new Teacher(req.body);
      await User.save();
      let result = await teacher.save();
      res.send(result);
    }
  }
});

app.post("/login", async (req, res) => {
  let User = await user.findOne(req.body).select("-password");
  if (User) {
    if (User.roles == "student") {
      let student = await Student.findOne({ email: User.email, name: User.name }).select("-__v");
      res.send(student);
    } else if (User.roles == "teacher") {
      let teacher = await Teacher.findOne({ email: User.email, name: User.name }).select("-__v");
      res.send(teacher);
    }
  } else {
    res.send({ notes: "Gagal" });
  }
});

app.get("/dashboard/create-question", async (req, res) => {
  let label = await LabelQuestion.find({}).select("-__v");
  res.send({ label: label });
});

app.get("/dashboard/create-class", async (req, res) => {
  let classes = await Class.find({}).select("-__v");
  res.send({ class: classes });
});

app.post("/dashboard/create-question/createLabel", async (req, res) => {
  let check = await LabelQuestion.findOne(req.body);
  if (check) {
    res.send({ notes: "gagal" });
  } else {
    let label = new LabelQuestion(req.body);
    await label.save();
    res.send({ notes: "berhasil" });
  }
});

app.post("/dashboard/create-class/createclass", async (req, res) => {
  let check = await Class.findOne(req.body);
  if (check) {
    res.send({ notes: "gagal" });
  } else {
    let label = new Class(req.body);
    await label.save();
    res.send({ notes: "berhasil" });
  }
});

app.post("/dashboard/create-question/create", async (req, res) => {
  let question = new Question(req.body);
  if (await question.save()) {
    res.send({ notes: "berhasil" });
  } else {
    res.send({ notes: "gagal" });
  }
});

app.post("/dashboard/create-question/getquestions", async (req, res) => {
  let questions = await Question.find({ keyLabel: req.body.key });
  res.send(questions);
});

app.delete("/dashboard/create-question/delete/:id", async (req, res) => {
  let notes = await Question.deleteOne({ _id: req.params.id }).then(res.send({ notes: "berhasil" }));
});

app.delete("/dashboard/create-question/deletelabel/:id", async (req, res) => {
  let notes = await LabelQuestion.deleteOne({ _id: req.params.id }).then(res.send({ notes: "berhasil" }));
});

app.delete("/dashboard/create-class/deleteclass/:id", async (req, res) => {
  let notes = await Class.deleteOne({ _id: req.params.id }).then(res.send({ notes: "berhasil" }));
});

app.post("/teacher/class/quiz/createquiz", async (req, res) => {
  let check = await Quiz.findOne(req.body);
  if (check) {
    res.send({ notes: "gagal" });
  } else {
    let quiz = new Quiz(req.body);
    await quiz.save();
    res.send({ notes: "berhasil" });
  }
});

app.post("/teacher/class/quiz", async (req, res) => {
  let quiz = await Quiz.find({ keyClass: req.body.key }).select("-__v");
  res.send({ quiz: quiz });
});

app.post("/teacher/class/quiz/question/listlabel/listquestion/addquestion", async (req, res) => {
  let question = await Question.find({ _id: req.body.keyQuestion });
  let quiz = await Quiz.find({ _id: req.body.keyQuiz });
  const temp = quiz[0].listQuestion;
  temp.push(question[0]);
  if (await Quiz.updateOne({ _id: req.body.keyQuiz }, { $set: { listQuestion: temp } })) {
    res.send({ notes: "berhasil" });
  }
});

app.post("/teacher/class/quiz/question", async (req, res) => {
  let quiz = await Quiz.find({ _id: req.body.keyQuiz });
  res.send({ question: quiz[0].listQuestion });
});

app.post("/student/inputtoken/submit", async (req, res) => {
  let check = await Class.findOne({ token: req.body.token });
  let check2 = await Student.findOne({ _id: req.body.id });
  if (check && check2) {
    if (await Student.updateOne({ _id: req.body.id }, { $set: { class: check._id } })) {
      res.send({ notes: "success" });
    } else {
      res.send({ notes: "failed" });
    }
  } else {
    res.send({ failed: "failed" });
  }
});

app.post("/student/class/quiz/started", async (req, res) => {
  let quiz = await Quiz.find({ _id: req.body.key }).select("listQuestion");
  res.send({ quiz: quiz });
});

app.post("/student/search/grade", async (req, res) => {
  let checking = await GradingRoom.find({ userID: req.body.userID, quizID: req.body.quizID });
  let check2 = await Student.find({ _id: req.body.userID });
  console.log(check2);
  let grades = check2[0].grade;
  let expNow = check2[0].experience;
  let levelNow = check2[0].level;

  if (checking.length == 0) {
    let grade = new GradingRoom({ userID: req.body.userID, quizID: req.body.quizID, attempt: 1, grade: req.body.grade });

    if ((await grade.save()) && (await Student.updateOne({ _id: req.body.userID }, { $set: { grade: grades + parseInt(req.body.grade) } }))) {
      console.log("grade save successfully");

      if (req.body.grade >= 80) {
        var levelUp = Math.floor((expNow + parseInt(req.body.grade)) / 80);
        var restExp = (expNow + parseInt(req.body.grade)) % 80;

        if ((await Student.updateOne({ _id: req.body.userID }, { $set: { level: parseInt(levelNow) + parseInt(levelUp) } })) && (await Student.updateOne({ _id: req.body.userID }, { $set: { experience: restExp } }))) {
          var newQuery = await Student.find({ _id: req.body.userID });
          res.send({ data: newQuery });
        }
      }
    }
  } else {
    let grade = new GradingRoom({ userID: req.body.userID, quizID: req.body.quizID, attempt: checking.length + 1, grade: parseInt(req.body.grade) });

    if (req.body.grade >= 80) {
      let checker = await GradingRoom.find({ userID: req.body.userID, quizID: req.body.quizID, grade: { $gte: 80 } });
      if (checker.length == 0) {
        var levelUp = Math.floor((expNow + parseInt(req.body.grade)) / 80);
        var restExp = (expNow + parseInt(req.body.grade)) % 80;

        if ((await Student.updateOne({ _id: req.body.userID }, { $set: { level: parseInt(levelNow) + parseInt(levelUp) } })) && (await Student.updateOne({ _id: req.body.userID }, { $set: { experience: restExp } }))) {
          var newQuery = await Student.find({ _id: req.body.userID });
          res.send({ data: newQuery });
        }
      }
    }

    if (await grade.save()) {
      console.log("grade save successfully");
    }
  }
});

app.post("/student/search/thequiz", async (req, res) => {
  let checking = await GradingRoom.find({ userID: req.body.userID, quizID: req.body.quizID });
  if (checking.length == 0) {
    res.send({ attemp: 0, firstGrading: 0, lastGrading: 0 });
  } else {
    res.send({ attemp: checking[checking.length - 1].attempt, firstGrading: checking[0].grade, lastGrading: checking[checking.length - 1].grade });
  }
});

app.post("/student/leaderboard", async (req, res) => {
  let query = await Student.find({ class: req.body.keyClass }).select("name").select("grade");
  if (query.length != 0) {
    res.send({ data: query });
  }
});

app.post("/teacher/class/quiz/grades", async (req, res) => {
  let usr = await GradingRoom.find({ quizID: req.body.keyQuiz }).select("userID").select("grade").select("attempt").select("-_id");
  for (let i = 0; i < usr.length; i++) {
    let query = await Student.find({ _id: usr[i].userID });
    usr[i].userID = query[0].name;
  }
  res.send({ data: usr });
});

app.delete("/teacher/class/quiz/delete/:id", async (req, res) => {
  let notes = await Quiz.deleteOne({ _id: req.params.id }).then(res.send({ notes: "berhasil" }));
});

app.post("/teacher/class/quiz/question/delete", async (req, res) => {
  let query = await Quiz.find({ _id: req.body.keyQuiz });
  let listQuestions = query[0].listQuestion;
  var removed = listQuestions.splice(req.body.index, 1);

  if (await Quiz.updateOne({ _id: req.body.keyQuiz }, { $set: { listQuestion: listQuestions } })) {
    res.send({ notes: "berhasil" });
  }
});

app.get("/", (req, res) => {
  res.send("app is working");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
