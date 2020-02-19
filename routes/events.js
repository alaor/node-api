const express = require('express')
const router = express.Router()
const Event = require('../models/event')

// Getting all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/autocomplete/:filter', async (req, res) => {
  try{
    const filter = req.params.filter;
    const events = await Event.find({
      event: { $regex: new RegExp(filter), $options: 'i'}})
      .sort({timestamp: -1})
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Creating one event
router.post('/', async (req, res) => {
  console.log(req.body);
  const event = new Event({
    event: req.body.event
  })

  try {
    const newEvent = await event.save()
    res.status(201).json(newEvent)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Getting one event
router.get('/:id', getEvent, (req, res) => {
  console.log('get: ' + req.params.id)
  res.json(res.event)
})

// Updating one event
router.patch('/:id', getEvent, async (req, res) => {
  if (req.body.name != null) {
    res.event.name = req.body.name
  }

  try {
    const updatedEvent = await res.event.save()
    res.json(updatedEvent)
  } catch {
    res.status(400).json({ message: err.message })
  }

})
// Deleting one event
router.delete('/:id', getEvent, async (req, res) => {
  try {
    await res.event.remove()
    res.json({ message: 'Deleted This Event' })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

// Middleware function for gettig event object by ID
async function getEvent(req, res, next) {
  try {
    event = await Event.findById(req.params.id)
    if (event == null) {
      return res.status(404).json({ message: 'Cant find event'})
    }
  } catch(err){
    return res.status(500).json({ message: err.message })
  }
  
  res.event = event
  next()
}

module.exports = router 