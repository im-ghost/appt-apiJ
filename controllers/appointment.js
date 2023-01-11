const User = require("../models/User.js")
const Appointment = require("../models/Appointment.js")
const {
  addUserApppointment,
  addDoctorAppointment
} = require("../controllers/user.js")
const createAppointment = async (req,res,next) =>{
  const {
    name,
    userId,
    doctorId,
    time
  } = req.body;
  if(!name|| !userId || !doctorId || !time){
    throw new Error("All fields are required")
  }
  const appointment = Appointment.create({
    name,
    userId,
    doctorId,
    time
  })
  const doctor = User.findById(doctorId)
  const user = User.findById(userId)
 
  if(!user){
    throw new Error("User not found ")
  }
  if(!doctor){
    throw new Error("Doctor not found")
  }
  if(appointment){
    
    await addDoctorAppointment(doctor,appointment._id);
   await addUserApppointment(user,appointment._id)
  res.status(200).json({appointment:appointment})
  }else{
    throw new Error("Error")
  }
}
const getDoctorAppointments = (req,res,next) =>{
  const doctor = User.findById(req.params.id);
  if(doctor){
    res.status(201).json({appointment:doctor.appointments})
  }else{
    throw new Error("Doctor not found ")
  }
}
const getAppointmentById = (req,res,next) =>{
    const appointment = Appointment.findById(req.params.id);
  if(doctor){
    res.status(201).json({appointment:appointment})
  }else{
    throw new Error("Appointment not found ")
  
}
const getUserAppointments = (req,res,next) =>{
    const doctor = User.findById(req.params.id);
  if(doctor){
    res.status(201).json({appointment:doctor.appointments})
  }else{
    throw new Error("User not found ")
  
}
const deleteAppointment = async (req,res,next) =>{ 
  const appointment = await Appointment.findById(req.params.id)

  if (appointment) {
    await appointment.remove()
    res.json({ message: 'Appointment removed' })
  } else {
    res.status(404)
    throw new Error(' Appointment not found')
  }}
const updateAppointment = (req,res,next) =>{
  const appointment = await Appointment.findById(req.params.id)

  if (appointment) {
for (const attr in appointment) {
    user.attr = req.body.attr ? req.body.attr : appointment.attr
    
}
    const updatedAppt = await appointment.save()

    res.json(updatedAppt)
  } else {
    res.status(404)
    throw new Error('Appointment not found')
  }
}

module.exports = {
   createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  deleteAppointment,
  getAppointmentById,
  updateAppointment,
}