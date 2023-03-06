const User = require("../models/User.js")
const Appointment = require("../models/Appointment.js")
const {
  addUserApppointment,
  addDoctorAppointment,
} = require("../controllers/user.js")
const createAppointment = async (req,res,next) =>{
  const { doctorId, appointmentDate , userId , name} = req.body;

  try {
    // Check if the doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
const existingAppointment = await Appointment.findOne({ doctor: doctor._id, startTime: appointmentDate });

if (existingAppointment) {
  // The selected time slot is not available, throw an error or handle it in some way
  throw new Error('The selected time slot is not available');
}

// Create the appointment
    const appointment = new Appointment({
      doctor: doctorId,
      date: appointmentDate,
      userId: userId,
      name:name
    });
    await appointment.save();

    // Update the doctor's availability
    const updatedTimeSlots = availableTimeSlots.map((timeSlot) => {
      if (timeSlot.date === appointmentDate) {
        timeSlot.available = false;
      }
      return timeSlot;
    });
    doctor.availability = updatedTimeSlots;
    await doctor.save();
   await addDoctorAppointment(doctor,appointment._id,appointment.time);
   await addUserApppointment(user,appointment._id,appointment.time)
    res.status(200).json({ message: 'Appointment created successfully' ,appointment:appointment});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while creating the appointment' });
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
}
const getUserAppointments = (req,res,next) =>{
    const doctor = User.findById(req.params.id);
  if(doctor){
    res.status(201).json({appointment:doctor.appointments})
  }else{
    throw new Error("User not found ")
  
}
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
const updateAppointment = async (req,res,next) =>{
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