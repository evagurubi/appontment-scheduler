const Appointment = require("../services/appointmentService");

exports.list = (req, res) => {
  // console.log(req.query);
  //res.send("Got it");
  let page = 0;
  let date = null;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page) - 1;
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
    if (req.query.date) {
      date = req.query.date;
    }
  }
  Appointment.list(10, page, date).then((result) => {
    // console.log(result);
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  Appointment.findById(req.params.id).then((result) => {
    res.status(200).send(result);
  });
  /* console.log(req.params);
  res.send("Got id request");*/
};

exports.insert = (req, res) => {
  Appointment.createAppointment(req.body).then((result) => {
    if (result.id) res.status(201).send({ id: result._id });
    else {
      res.status(201).send({ message: result.message });
    }
  });
};

exports.patchById = (req, res) => {
  Appointment.patchAppointment(req.params.id, req.body).then((result) => {
    if (result.message) res.status(201).send({ message: result.message });
    else {
      res.status(201).send({ id: result._id });
    }
  });
};

exports.removeById = (req, res) => {
  Appointment.removeById(req.params.id).then((result) => {
    res.status(204).send({});
  });
};
