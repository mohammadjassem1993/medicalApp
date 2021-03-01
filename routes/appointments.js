const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;   

const Appointment = require('../model/appointments.js');
const User = require("../model/User");

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
router.post('/newAppointment', async(req, res) => {
    const appointment = new Appointment({
        patientId: new ObjectId(req.params.patientId),
        machineId: req.user.id,
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