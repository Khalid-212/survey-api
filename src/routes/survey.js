const express = require('express')
const router = express.Router()
const { auth, authAdmin, setRequestUser } = require('../middleware/auth')

const Survey = require('../models/survey')
const Question = require('../models/question')
const Entry = require('../models/entry')
const User = require('../models/user')

const SurveyView = require('../views/survey')
const EntryView = require('../views/entry')
const QuestionView = require('../views/question')
const ResultView = require('../views/result')

router.get('/', setRequestUser, async (req, res) => {
	const populate = ['createdBy']
	try {
		const user = req.user ? await User.findById(req.user.id) : {}
		let surveys = await Survey.find({}).populate(populate)
		surveys = surveys.filter(i => {
			return user.role === 'COORDINATOR' || i.status === 'ACTIVE' || i.status === 'CLOSED'
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

router.get('/:id/result', auth, async (req, res) => {
	const populate = ['questions', 'createdBy']
	try {
		const survey = await Survey.findById(req.params.id).populate(populate)
		const entries = await Entry.find({ survey: req.params.id })

		let result = survey.questions.map(i => QuestionView(i))
		await result.forEach(async (item) => {
			item.result = []
			await entries.forEach((i) => {
				const questionAns = i.answers.find(x => {
					const id1 = x.question.toString()
					const id2 = item.id.toString()
					return id1 == id2
				}).answer
				const index = item.options.indexOf(questionAns)
				item.result[index] = item.result[index] ? item.result[index] + 1 : 1
			})
		})
		res.status(200).json(
			ResultView(survey, populate, result)
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

router.put('/status/:id', authAdmin, async (req, res) => {
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
