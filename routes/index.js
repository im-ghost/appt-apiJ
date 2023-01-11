const express = require('express');
const router = express.Router();
/* GET the default API route. */
router.get('/', (req, res, next) =>{
  res.json('index').status(200);
});

module.exports = router;
