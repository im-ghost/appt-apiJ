const jwt = require('jsonwebtoken')
const User = require('../models/User.js')
const Appointment = require('../models/Appointment.js')
require("dotenv").config()
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: '30d',
  })
}
const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization
  ) {
    try {
      // Get token from header
      token = req.headers.authorization
 //    console.log(token)
      // Verify token
      const decoded = jwt.verify(token, process.env.SECRET)
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password')
    // console.log(req.user)
      next()
    } catch (error) {
      console.log("Nit authorized ")
      console.log(error)
      res.status(401).json({"mes":"not authorized"})
    }
  }

  if (!token) {
    console.log("No token")
    res.status(401).json({"mes":"no token"})
  }
}
const protectMe =(req,res,next) =>{
  console.log(req.user._id.toHexString())
    if(req.user._id.toHexString() === req.params.id){
      console.log("correct user ")
        next()
    }else{
        
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
}
const protectAppointment =(req,res,next) =>{
  const appointmentId = req.params.id;
  const userId = req.user._id;
  const appointment = Appointment.findById(appointmentId)
    if(userId === appointment.userId){
      console.log("correct user ")
        next()
    }else{
        
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
}
module.exports = {
    generateToken,
    protect,
    protectMe,
    protectAppointment
}
