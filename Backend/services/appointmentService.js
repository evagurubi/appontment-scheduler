const Appointment = require("../models/Appointment");

exports.list = (perPage, page, date) => {
  return new Promise((resolve, reject) => {
    if (date) {
      Appointment.find({ startDate: date })
        .limit(perPage)
        .skip(perPage * page)
        .exec(function (err, appointments) {
          if (err) {
            reject(err);
          } else {
            resolve(appointments);
            // console.log(appointments);
          }
        });
    } else
      Appointment.find()
        .limit(perPage)
        .skip(perPage * page)
        .exec(function (err, appointments) {
          if (err) {
            reject(err);
          } else {
            resolve(appointments);
            //  console.log(appointments);
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

exports.createAppointment = async (appointmentData) => {
  let newStartTime = appointmentData.startTime;
  let newEndTime = appointmentData.endTime;

  //console.log(Date.now());
  // console.log(newStartTime);

  let bookingConflict = await Appointment.find()
    .where("startTime")
    .lt(newEndTime)
    .where("endTime")
    .gt(newStartTime)
    .exec();

  if (Date.parse(newStartTime) > Date.parse(newEndTime))
    return {
      message: `Appointment should start before it finishes.`,
    };
  if (Date.parse(newStartTime) < Date.now())
    return {
      message: `Appointment should be in the future.`,
    };
  if (Date.parse(newEndTime) - Date.parse(newStartTime) > 1800000)
    return {
      message: `Appointment should be shorter than 30 minutes.`,
    };
  if (bookingConflict.length === 0) {
    const appointment = new Appointment(appointmentData);
    console.log(appointment);
    return appointment.save();
  } else {
    return {
      message: `There is already a booking from ${newStartTime} to ${newEndTime}`,
    };
  }
};

exports.patchAppointment = async (id, appointmentData) => {
  let newStartTime = appointmentData.startTime;
  let newEndTime = appointmentData.endTime;

  console.log(Date.now());
  console.log(newStartTime);

  let bookingConflict = await Appointment.find()
    .where("startTime")
    .lt(newEndTime)
    .where("endTime")
    .gt(newStartTime)
    .exec();

  if (Date.parse(newStartTime) > Date.parse(newEndTime))
    return {
      message: `Appointment should start before it finishes.`,
    };
  if (Date.parse(newStartTime) < Date.now())
    return {
      message: `Appointment should be in the future.`,
    };
  if (Date.parse(newEndTime) - Date.parse(newStartTime) > 1800000)
    return {
      message: `Appointment should be shorter than 30 minutes.`,
    };
  if (bookingConflict.length === 0) {
    /* const appointment = new Appointment(appointmentData);
    return appointment.save();*/
    return Appointment.findOneAndUpdate(
      {
        _id: id,
      },
      appointmentData
    );
  } else {
    return {
      message: `There is already a booking from ${newStartTime} to ${newEndTime}`,
    };
  }
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
