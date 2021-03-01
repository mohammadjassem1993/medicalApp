const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;   

const Appointment = require('../model/appointments.js');

// get all appointments
router.get('/', async(req, res) => {
    try {

        let p = await Appointment.find({})
            res.send(p)
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Create a new patient and add it to the database
router.post('/new', async(req, res) => {
    const appointment = new Appointment({
        patient: new ObjectId(req.params.patient),
        channel: req.body.channel,
        dateAndTime: req.body.dateAndTime,
        endDateAndTime: req.body.endDateAndTime
    });
    try {
        const savedAppointment = await appointment.save();
        res.json({ error: null, data: savedAppointment });
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router