const {
  generateToken
} = require("../middlewares/auth.middleware")
const User = require('../models/User.js');
const moment = require("moment");

const checkAvailableDoctorSlots = async (req,res)=>{
// Return all available time slots for a doctor
User.findOne({ _id: req.params.id }, (err, doctor) => {
  if (err) {
    console.log(err);
    return;
  }

  if (!doctor) {
    res.status(500).json({"error":'Doctor not found'});
  }
  const startDate = moment().startOf('week'); // start of current week
const endDate = moment().endOf('week'); // end of current week
const availableSlots = [];

// Loop through each day of the week
for (let date = startDate.clone(); date.isBefore(endDate); date.add(1, 'day')) {
  const dayOfWeek = date.isoWeekday();
  const dayAvailability = doctor.availability.find((slot) => slot.dayOfWeek === dayOfWeek);

  // If the doctor is available on this day, create time slots
  if (dayAvailability) {
    const startTime = moment(`${date.format('YYYY-MM-DD')} ${dayAvailability.startTime}`, 'YYYY-MM-DD HH:mm');
    const endTime = moment(`${date.format('YYYY-MM-DD')} ${dayAvailability.endTime}`, 'YYYY-MM-DD HH:mm');
    let slotTime = startTime.clone();

    while (slotTime.isBefore(endTime)) {
      availableSlots.push(slotTime.format('YYYY-MM-DDTHH:mm:ss'));
      slotTime.add(30, 'minutes');
    }
  }
   }
   res.status(201).json({slots:availableSlots})
  })
}

const authUser = async (req, res) => {
  const { email, password } = req.body
console.log(req.body)
  const user = await User.findOne({ email })

  if (user){
    console.log(user)
     if(await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      appointments: user.appointments,
      token: generateToken(user._id),
    })
  }
  else{
    res.status(400).json({"error":"Wrong password "})
  }
} else {
    res.status(400).json({"error":"Wrong email "})
  }
}
const registerUser = async (req, res) => {
  
  const { name,
  email,
  password ,
  specialties,
  isDoctor,
  availability
  } = req.body
console.log(req.body)
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).json({'error':'User already exists'})
  }
   const days = availability;
        const daysArray = days.split(",");
        const pay = []
        for(day of daysArray){
          const d = {
            dayOfTheWeek:day.split(-)[0],
            startTime:day.split(-)[1],
            endTime:day.split(-)[2],
          }
          pay.push(d)
        }
  const user = await User.create({
    name:name,
    email:email,
    password: password,
    appointments:[],
    specialties :specialties,
    isDoctor : isDoctor,
    availability: pay
    reviews:[]
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      appointments: user.appointments,
      specialties: user.specialties,
      isDoctor:user.isDoctor,
      token: generateToken(user._id),
     availability : user.availability,
      reviews: user.reviews
    })
  } else {
    res.status(400).json({'error':'Invalid user data'})
  }
}
const getUsers = async (req, res) => {
  const users = await User.find({})
  console.log(users)
  res.status(200).json(users)
}
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
for (const attr in user) {
    user.attr = req.body.attr ? req.body.attr : user.attr
    
}
    const updatedUser = await user.save()

    res.json(updatedUser)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}
const addUserApppointment = async (user, appointmentId,appointmentTime) => {

  if (user) {
    
    for (const appointment in user.appointments){
      if(appointment.time === appointmentTime){
        res.status(201).json({message:"The User has an appointment by this time"})
      }
    }
    const userAppt = user.appointments;
    userAppt.push(appointmentId)
    user.appointments = userAppt
    const updatedUser = await user.save()

    res.json(updatedUser)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}
const addDoctorAppointment = async (doctor,appointmentId,appointmentTime) => {
  if (doctor) {
    const doctorsAppt = doctor.appointments;
    doctorsAppt.push(appointmentId)
    doctor.appointments = doctorsAppt
    const updatedDoctor = await doctor.save()

    res.json(updatedDoctor)
  } else {
    res.status(404)
    throw new Error('Doctor not found')
  }
}

module.exports = {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addUserApppointment,
  addDoctorAppointment,
  checkAvailableDoctorSlots
}