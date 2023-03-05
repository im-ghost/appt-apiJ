const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    token:{
      type:String
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    appointments:{
      type:Array,
      default:[]
    
    },
    isDoctor:{
      type:Boolean,
      default:false
    },
    specialties:{
      type: Array,
      default: []
    },
    reviews: [{
    reviewer: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String
    }
  }],
    availability: [
    {
      dayOfWeek: {
        type: Number,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
  ],
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  if(enteredPassword === this.password){
    return true
  }
  else{
    return false
  }
}
  

const User = mongoose.model('User', userSchema)

module.exports=User
