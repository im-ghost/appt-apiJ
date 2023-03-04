const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const apptSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId:{
      type:String,
      required:true
    },
    doctorId:{
      type:String,
      required:true
    },
    date: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

  

const Appointment = mongoose.model('Appointment', apptSchema)

module.exports= Appointment 
