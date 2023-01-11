const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  deleteAppointment,
  getAppointmentById,
  updateAppointment,
} = require("../controllers/appointments");
const {
  protect,
  protectAppointment
 } = require('../middlewares/auth.middleware');

router.get("/user/:id",protect,getUserAppointments)
router.get("/doctor/:id",protect,getDoctorAppointments)
router.post("/",createAppointment)
router.put("/appointment/:id",protect,protectAppointment,updateAppointment)
router.delete("/appointment/:id",protect,protectAppointment ,deleteAppointment)
router.get("/appointment/:id",protect,getAppointmentById)
module.exports = router;
