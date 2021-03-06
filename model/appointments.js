var mongoose = require('mongoose');

// Appointments Schema
var AppointmentSchema = mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient',
    required: true
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
  channel: {
      type: String,
      required: true
  },
  department: {
    type: String,
    required: true
  },
  referralId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referrals"
  },
  treatmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diagnosis"
  },
  dateAndTime: { 
      type: Date, 
      required: true 
    },
  endDateAndTime: { 
      type: Date, 
      required: true 
    },
  remarks: {
    type: String
  },
  // appointment missed or completed
  status: {
    type: Boolean
  }
});

AppointmentSchema.virtual('duration')
  .get(function () {
    var durationMs = this.endDateAndTime - this.dateAndTime;
    if (durationMs) {
      return Math.abs(this.endDateAndTime - this.dateAndTime) / 1000 / 60;
    }
    else {
      return;
    }
  });

AppointmentSchema.path('dateAndTime').validate({
  validator: function (value) {
    var self = this;
    return new Promise(function(resolve, reject) {
      mongoose.models.Appointment.find( { 
        '_id': { $ne: self._id },
        $or: [ 
          { dateAndTime: { $lt: self.endDateAndTime, $gte: self.dateAndTime } }, 
          { endDateAndTime: { $lte: self.endDateAndTime, $gt: self.dateAndTime } }
        ] 
      }, function (err, appointments) {
        resolve(! appointments || appointments.length === 0);
      });  
    })
  },
  message: "The appointment overlaps with other appointments"
});

AppointmentSchema.path('dateAndTime').validate(function (value) {
  var isValid = true;
  if (value < new Date()) {
    isValid = false;
  }
  return isValid;
}, "The appointment can not be scheduled in the past");


module.exports = mongoose.model('Appointment', AppointmentSchema);