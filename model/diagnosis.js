const mongoose = require('mongoose');

//  Diagnosis Schema
var DiagnosisSchema = mongoose.Schema({
	diagnosedCondition: {
		type: String,
		required: true,
		max: 255
	},
	prescribedTreatment: {
		type: String,
		required: true,
		max: 255
	},
	treatmentId:{
		type: String,
		required: true,
		max: 255
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
    diagnosisLinks:[ {  //  Contains links to the supporting documents for the specific diagnosis
		type: String,
	
	  }]
});

module.exports = mongoose.model('Diagnosis', DiagnosisSchema);