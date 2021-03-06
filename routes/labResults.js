const router = require("express").Router();
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;   

const result = require('../model/labResult.js');
const Patient = require('../model/patients.js');
const User = require("../model/user");


// get all results
router.get('/', async(req, res) => {

    try {

        let p = await result.find({})
            res.send(p)


    } catch (error) {
        res.status(400).json({ error });
    }
});




//post test result
router.post('/newResult', async(req, res) => {
    // Create a new lab result record
    const r = new result({
        machineName: _.capitalize(req.body.machineName),
        patientId: req.body.patientId,
        machineId: req.user.id,
        reportsLinks: req.body.reportsLinks

    });
    console.log(r);
    try {
        const savedResult = await r.save();
        res.json({ error: null, data: savedResult });
    } catch (error) {
        res.status(400).json({ error });
    }
});


//get report by id
router.get('/id/:id/', async(req, res) => {
    var id = new ObjectId(req.params.id);
    try {
        let r = await result.findById(id)

        if (r) {

            res.send(r)
        } else {
            res.send("Result does not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Get all results for one machine
router.get('/machine/:id/', async(req, res) => {
    var id = new ObjectId(req.params.id);
    
    try { //the machine is registerd as a user
        let m = await User.findById(id)
        if (m) {
            let r = await result.find({machineId: id})
            res.send(r)
        } else {
            res.send("Machine does not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});



// Get all results for one patient
router.get('/patient/:id/', async(req, res) => {
    var id = new ObjectId(req.params.id);
    
    try { //the machine is registerd as a user
        let p = await Patient.findById(id)
        if (p) {
            let r = await result.find({patientId: id})
            res.send(r)
        } else {
            res.send("Patient does not exist")
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});





module.exports = router;
