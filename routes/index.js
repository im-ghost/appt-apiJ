const express = require('express');
const router = express.Router();
const quizRouter= require("./quiz")
const authRouter = require("./users")

/* GET the default API route. */
router.get('/', (req, res, next) =>{
  res.json('index').status(200);
});
router.get('/quiz',quizRouter );
router.get('/users',authRouter );

module.exports = router;
