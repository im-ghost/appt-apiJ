const {
  generateToken
} = require("../middlewares/auth.middleware")
const User = require('../models/User.js');
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body
console.log(req.body)
  const user = await User.findOne({ email })

  if (user){
     if(await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      quizes: user.quizes,
      token: generateToken(user._id),
    })
  }
  else{
    res.status(401).json({"error":"wrong passwod"})
  }
} else {
    res.status(401).json({"error":"invalid email"})
  }
}

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  
  const { name, email, password } = req.body
console.log(req.body)
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name:name,
    email:email,
    password: password
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      quizes: user.quizes,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
}
// @desc    Get all users
// @route   GET /api/user
const getUsers = async (req, res) => {
  const users = await User.find({})
  res.json(users)
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
const addUserApppointment = async (user, appointment._id) => {

  if (user) {
    
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
const addDoctorAppointment = async (doctor,appointmentId) => {
const user = doctor
  if (doctor) {
    const doctorsAppt = doctor.appointments;
    doctorsAppt.push(appointmentId)
    doctor.appointments = doctorsAppt
    const updatedDoctor = await doctor.save()

    res.json(updatedDoctor)
  } else {
    res.status(404)
    throw new Error('User not found')
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
  addDoctorAppointment
}