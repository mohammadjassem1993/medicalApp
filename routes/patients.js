const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;   

const Patient = require('../model/patients.js');

// get all patients
router.get('/', async(req, res) => {
    console.log(req.user.id)
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

// Create a new patient and add it to the database
router.post('/register', async(req, res) => {
    const patient = new Patient({
        patientName: _.capitalize(req.body.patientName),
        machineId: req.user.id,
        gender: req.body.gender,
        emailId: req.body.emailId,
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

// Delete patient in database using object id
router.delete('/id/:id', async(req, res) => {
    try {
        var id = new ObjectId(req.params.id);
        var query = { _id: id };
        const result = await Patient.deleteOne(query);
        if (result.deletedCount === 1) {
            res.json({ message: "Successfully deleted 1 document." });
        } else {
            res.json({ message: "No documents matched the query. Deleted 0 documents." });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

// Update patient document using object id
router.put('/id/:id', async(req, res) => {
    try {
        var id = new ObjectId(req.params.id);
 
        var status = ''
        var updateDoc = {
            $set: {
                patientName: _.capitalize(req.body.patientName),
                machineId: req.user.id,
                gender: req.body.gender,
                emailId: req.body.emailId,
                dateOfBirth: req.body.dateOfBirth,
                phoneNumber: req.body.phoneNumber
            },
        };
    
        const result = await Patient.updateOne({_id: id}, updateDoc);
        if (result.nModified === 1) {
            res.json({ message: "Successfully updated 1 document." , status: status});
        } else {
            res.json({ message: "No documents matched the query. 0 documents modified.", status: status});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})

module.exports = router;
