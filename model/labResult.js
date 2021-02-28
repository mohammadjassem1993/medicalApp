const mongoose = require('mongoose');

// lab Result Schema
var ResultSchema = mongoose.Schema({

	createdDate: {
		type: Date,
		default: Date.now
	},
	patientId:{
		type: String,
		required: true,
		max: 255
	},
	machineName:{
		type: String,

		max: 255
	},
	machineId:{
		type: String,
		required: true,
		max: 255
	},
	reportsLinks:[ {  //contains links to the Xray Images or pdf reports
		type: String,
	
	  }]

});

module.exports = mongoose.model('labResult', ResultSchema);