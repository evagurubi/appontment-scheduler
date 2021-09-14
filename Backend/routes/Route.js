const router = require("express").Router();
const AppointmentController = require("../controllers/appointment.controller");

router.get("/test", async (req, res) => {
  res.json({ message: "pass!" });
});

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/appointment", AppointmentController.insert);

router.get("/appointment", AppointmentController.list);

router.get("/appointment/:id", AppointmentController.getById);

router.patch("/appointment/:id", AppointmentController.patchById);

router.delete("/appointment/:id", AppointmentController.removeById);

module.exports = router;
