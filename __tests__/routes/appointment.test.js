const supertest= require("supertest")

const mongoose = require("mongoose")
const app = require("../../app")
const { MongoMemoryServer } = require("mongodb-memory-server");
const id = mongoose.Types.ObjectId.toString()
beforeAll(async ()=>{
  /*const mongodb = MongoMemoryServer.create()
  await mongoose.connect(mongodb.getUri())
})
afterAll(async ()=>{
  await mongoose.disconnect()
  await mongoose.connection.close()*/
})
describe("x", ()=>{
  test("test",async()=>{
    const res = await supertest(app).get("/api/")
    
    expect(res).toBeDefined()
  })
})