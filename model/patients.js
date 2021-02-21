const mongoose = require('mongoose');

// User Schema
var PatientSchema = mongoose.Schema({
	patientName: {
		type: String,
		required: true,
		max: 255
	},
	dateOfBirth: {
		type: String,
		required: false
	},
    phoneNumber: {
        type: String,
        required: false
    },
    emailID: {
        type: String,
        required: true,
    	max: 255
    },
	gender: {
		type: String,
		required: false
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Patient', PatientSchema);