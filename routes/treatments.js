const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;   

const Appointment = require('../model/appointments.js');
const Diagnosis = require('../model/diagnosis.js');

//post Diagnosis result
router.post('/newDiagnosis', async(req, res) => {
     // authorize the user roles
     let a =await authorize(req.user.id,['admin','clerk','doctor','nurse','paramedic']);

     if(!a){
         res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
     }
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


//get diagnosis by patient id
router.get('/id/:id/', async(req, res) => {
     // authorize the user roles
     let a =await authorize(req.user.id,['admin','clerk','doctor','nurse','paramedic']);

     if(!a){
         res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
     }
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

// get appointments based on prescribed treatment name
router.get('/treatment/:prescribedTreatment', async(req, res) => {
     // authorize the user roles
     let a =await authorize(req.user.id,['admin','clerk','doctor','nurse','paramedic']);

     if(!a){
         res.status(401).json({ error: 'Unauthorized, This action will be reported to an admin' })
     }
    var prescribedTreatment = req.params.prescribedTreatment;
    try {
        let treatment = await Diagnosis.find({prescribedTreatment: {"$regex": prescribedTreatment, "$options": "i"}})
        if (treatment) {
            res.send(Appointment)
        } else {
            res.send("This Treatment does not exist for the patient")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});






module.exports = router;