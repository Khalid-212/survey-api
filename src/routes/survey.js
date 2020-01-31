const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Survey = require('../models/survey');
const Question = require('../models/question');
const Entry = require('../models/entry');

router.get('/', auth, async (req, res) => {
  try {
    const surveys = await Survey.find({}).populate('createdBy');

    res.status(200).json(
      surveys
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id).populate(['questions', 'createdBy']);

    res.status(200).json(
      survey
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id/entries', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ survey: req.params.id })

    res.status(200).json(
      entries
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', auth, async (req, res) => {
  const { title, questions, description } = req.body;
  try {
    let questionsRef = await Question.insertMany(questions)

    let survey = new Survey({
      title,
      description,
      questions: questionsRef.map(i => i.id),
      createdBy: req.user.id
    });

    await survey.save();

    res.status(200).json(
      survey
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/status/:id', auth, async (req, res) => {
  try {
    const status = req.body.status.toUpperCase()

    let survey = await Survey.findById(req.params.id).populate(['questions', 'createdBy']);

    if (status !== 'IDLE' && status !== 'ACTIVE' && status !== 'CLOSED')
      return res.status(400).json({
        message: 'Invalid survey status'
      });
    survey.status = status
    await survey.save();

    res.status(200).json(
      survey
    );
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;
