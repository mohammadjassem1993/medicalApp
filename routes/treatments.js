const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;   

const Patient = require('../model/patients.js');
const User = require("../model/User");
const Diagnosis = require('../model/diagnosis.js');


//post Diagnosis result
router.post('/newDiagnosis', async(req, res) => {
    // Create a new record under diagnosis and Treatment services
    const d = new Diagnosis({
        diagnosedCondition: req.body.diagnosedCondition,
        prescribedTreatment: req.body.prescribedTreatment,
        treatmentId: req.body.treatmentId,
        diagnosisLinks: req.body.diagnosisLinks

    });
    console.log(d);
    try {
        const savedDiagnosis = await d.save();
        res.json({ error: null, data: savedDiagnosis });
    } catch (error) {
        res.status(400).json({ error });
    }
});


//get diagnosis and prescribed treatment by patient id
router.get('/id/:id/', async(req, res) => {
    var id = new ObjectId(req.params.id);
    try {
        let d = await Diagnosis.findById(id)

        if (d) {

            res.send(d)
        } else {
            res.send("Supporting Documents do not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});





module.exports = router;