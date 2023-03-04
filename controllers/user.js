const {
  generateToken
} = require("../middlewares/auth.middleware")
const User = require('../models/User.js');

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

  const availableTimeSlots = doctor.timeSlots.filter((timeSlot) => {
    return timeSlot.available === true;
  });

  res.status(200).json({'Available time slots  ' : availableTimeSlots});
});


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

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  
  const { name,
  email,
  password ,
  specialties,
  isDoctor,
  availableTimeSlots
  } = req.body
console.log(req.body)
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).json({'error':'User already exists'})
  }
  
  const user = await User.create({
    name:name,
    email:email,
    password: password,
    appointments:[],
    specialties :specialties,
    isDoctor : isDoctor,
   timeSlots : ()=>{
     const slots = [];
     for(i=0;i<=7;i++){
       for(j=0;j<=(24*20);j+=30){
         slots.push({
           start:Date.now()+ j,
           end: Date.now() + 2*j,
           available:true
        })
       }
     }
   },
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
     availableTimeSlots : user.availableTimeSlots,
      reviews: user.reviews
    })
  } else {
    res.status(400).json({'error':'Invalid user data'})
  }
}
// @desc    Get all users
// @route   GET /api/user
const getUsers = async (req, res) => {
  const users = await User.find({})
  console.log(users)
  res.status(200).json(users)
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
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

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
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