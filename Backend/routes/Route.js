const router = require("express").Router();
const AppointmentController = require("../controllers/appointment.controller");
const AppointmentModel = require("../models/Appointment");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/appointment", AppointmentController.insert);

router.get("/appointment", AppointmentController.list);

/*router.get("/appointment", (req, res) => {
  AppointmentModel.find().then((result) => res.json(result));
});*/

router.get("/appointment/:id", AppointmentController.getById);

router.patch("/appointment/:id", AppointmentController.patchById);

router.delete("/appointment/:id", AppointmentController.removeById);

module.exports = router;
