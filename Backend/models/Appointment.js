const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: { type: String },
  startDate: { type: String },
  startTime: { type: String },
  endDate: { type: String },
  endTime: { type: String },
});

/*appointmentSchema.findById = function (cb) {
  return this.model("Appointments").find({ id: this.id }, cb);
};*/

/*module.exports = mongoose.model("Appointment", appointmentSchema);*/
const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema,
  "Appointments"
);

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Appointment.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (err, appointments) {
        if (err) {
          reject(err);
        } else {
          resolve(appointments);
          console.log("Sent");
        }
      });
  });
};

exports.findById = (id) => {
  return Appointment.findOne({ _id: id }).then((result) => {
    result = result.toJSON();

    return result;
  });
};

exports.createAppointment = (appointmentData) => {
  const appointment = new Appointment(appointmentData);
  return appointment.save();
};

exports.patchAppointment = (id, userData) => {
  return Appointment.findOneAndUpdate(
    {
      _id: id,
    },
    userData
  );
};

exports.removeById = (id) => {
  return new Promise((resolve, reject) => {
    Appointment.deleteMany({ _id: id }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};
