const AppointmentModel = require("../models/Appointment");

exports.list = (req, res) => {
  /* console.log(req.query);
  res.send("Got it");*/
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  AppointmentModel.list(10, page).then((result) => {
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  AppointmentModel.findById(req.params.id).then((result) => {
    res.status(200).send(result);
  });
  /* console.log(req.params);
  res.send("Got id request");*/
};

exports.insert = (req, res) => {
  AppointmentModel.createAppointment(req.body).then((result) => {
    res.status(201).send({ id: result._id });
  });
};

exports.patchById = (req, res) => {
  AppointmentModel.patchAppointment(req.params.id, req.body).then((result) => {
    res.status(204).send({});
  });
};

exports.removeById = (req, res) => {
  AppointmentModel.removeById(req.params.id).then((result) => {
    res.status(204).send({});
  });
};
