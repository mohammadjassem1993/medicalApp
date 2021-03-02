const mongoose = require('mongoose');

// Patient Schema
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
    emailId: {
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