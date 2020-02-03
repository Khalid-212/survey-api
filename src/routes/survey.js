const express = require('express')
const router = express.Router()
const { auth, authAdmin, setRequestUser } = require('../middleware/auth')

const Survey = require('../models/survey')
const Question = require('../models/question')
const Entry = require('../models/entry')
const User = require('../models/user')

const SurveyView = require('../views/survey')
const EntryView = require('../views/entry')

router.get('/', setRequestUser, async (req, res) => {
	const populate = ['createdBy']
	try {
    const user = await User.findById(req.user.id)
		let surveys = await Survey.find({}).populate(populate)
    surveys = surveys.filter(i => {
      return user.role === 'COORDINATOR' || i.status === 'ACTIVE'
    })
		res.status(200).json(
			surveys.map(i => SurveyView(i, populate))
		)
	} catch (err) {
    // console.log(err)
		res.status(500).send(err.message)
	}
})

router.get('/:id', async (req, res) => {
	const populate = ['questions', 'createdBy']
	try {
		const survey = await Survey.findById(req.params.id).populate(populate)

		res.status(200).json(
			SurveyView(survey, populate)
		)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

router.get('/:id/entries', authAdmin, async (req, res) => {
	try {
		const entries = await Entry.find({ survey: req.params.id })

		res.status(200).json(
			entries.map(i => EntryView(i))
		)
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
})

router.post('/', authAdmin, async (req, res) => {
	const { title, questions, description } = req.body
	try {
		let questionsRef = await Question.insertMany(questions)

		let survey = new Survey({
			title,
			description,
			questions: questionsRef.map(i => i.id),
			createdBy: req.user.id
		})

		await survey.save()

		res.status(200).json(
			SurveyView(survey)
		)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

router.put('/status/:id', auth, async (req, res) => {
	const populate = ['questions', 'createdBy']
	try {
		const status = req.body.status.toUpperCase()

		let survey = await Survey.findById(req.params.id).populate(populate)

		if (status !== 'IDLE' && status !== 'ACTIVE' && status !== 'CLOSED')
			return res.status(400).json({
				message: 'Invalid survey status'
			})
		survey.status = status
		await survey.save()

		res.status(200).json(
			SurveyView(survey, populate)
		)
	} catch (err) {
		res.status(500).send(err)
	}
})


module.exports = router
