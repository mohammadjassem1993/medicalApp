const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;   

const Patient = require('../model/patients.js');

// get all patiants
router.get('/', async(req, res) => {
    console.log(req.user)
    try {

        let p = await Patient.find({})
            res.send(p)


    } catch (error) {
        res.status(400).json({ error });
    }
});

// Search patient in database using object id
router.get('/id/:id', async(req, res) => {
    var id = new ObjectId(req.params.id);
    try {
        let patient = await Patient.findById(id)
        if (patient) {
            res.send(patient)
        } else {
            res.send("Patient does not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Search patient in database using phone number
router.get('/number/:number', async(req, res) => {
    var number = req.params.number;
    try {
        let patient = await Patient.findOne({phoneNumber: number})
        if (patient) {
            res.send(patient)
        } else {
            res.send("Patient does not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Search patient in database using patient name
router.get('/name/:patientName', async(req, res) => {
    var patientName = req.params.patientName;
    try {
        let patient = await Patient.find({patientName: {"$regex": patientName, "$options": "i"}})
        if (patient) {
            res.send(patient)
        } else {
            res.send("Patient does not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.post('/register', async(req, res) => {
    // Create a new patient and add it to the database
    const patient = new Patient({
        patientName: _.capitalize(req.body.patientName),
        gender: req.body.gender,
        emailID: req.body.emailID,
        dateOfBirth: req.body.dateOfBirth,
        phoneNumber: req.body.phoneNumber
    });
    try {
        const savedPatient = await patient.save();
        res.json({ error: null, data: savedPatient });
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;
