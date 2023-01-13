const supertest= require("supertest")

const mongoose = require("mongoose")
const User = require("../../models/User")
const app = require("../../app")
const { MongoMemoryServer } = require("mongodb-memory-server");
const userId = mongoose.Types.ObjectId().toString();
const { generateToken } = require("../../middlewares/auth.middleware")
require("dotenv").config();
beforeAll(async ()=>{
  /*const mongodb = MongoMemoryServer.create()
  await mongoose.connect(mongodb.getUri())
})
afterAll(async ()=>{
  await mongoose.disconnect()
  await mongoose.connection.close()*/
})
describe("User routing", ()=>{
  const user = {
    name:"ghost ",
    isDoctor:false,
    email:"culestfrosh@gmail.com",
    password:"ababa",
    appointments:[],
    token : generateToken(userId)
  }
  const BASE_URL = "/api/users"
  describe("GET request",()=>{
    test("get all users",async ()=>{
     const res = await supertest(app).get(`${BASE_URL}`).set("authorization",user.token)
     console.log(res.body)
     expect(res).toBeDefined()
    })
  })
})