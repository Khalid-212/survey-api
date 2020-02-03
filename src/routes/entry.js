const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const Entry = require('../models/entry')
const EntryView = require('../views/entry')

router.post('/', async (req, res) => {
  const { answers, survey } = req.body
  try {

    let entry = new Entry({
      answers,
      survey
    })

    await entry.save()

    res.status(200).json(
      EntryView(entry)
    )
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({})

    res.status(200).json(
      entries.map(i => EntryView(i))
    )
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
