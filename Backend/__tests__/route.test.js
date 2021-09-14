const app = require("../server"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Appointment = require("../models/Appointment");
const testcases = require("./testcases.json");
let mongoServer;
let testID;

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  //console.log(collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

afterAll(async () => {
  await removeAllCollections();
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

/*afterEach(async () => {
  await removeAllCollections();
});*/

describe("Tests the test environment", () => {
  it("Tests to see if Jest works", () => {
    expect(1).toBe(1);
  });

  it("Gets the test endpoint", async () => {
    // Sends GET Request to /test endpoint
    //when
    const response = await request.get("/api/test");

    //then
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("pass!");
  });
});

describe("Tests for api/appointment", () => {
  it("Sends an empty array as response if GET request arrives when db is empty", async () => {
    // given an empty db
    //when
    const response = await request.get("/api/appointment");

    //then
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  it("Contains the item if it has been sent in a POST request to the endpoint", async () => {
    //given
    const newAppointment = {
      name: "Éva",
      startTime: "2021-10-19T12:32",
      endTime: "2021-10-19T12:52",
    };

    //when
    const response = await request
      .post("/api/appointment")
      .send(newAppointment);

    const appointments = await Appointment.find();
    testID = appointments[0]._id;
    console.log(testID);
    //then
    expect(response.status).toBe(201);
    expect(appointments.length).toEqual(1);
    expect(appointments[0].name).toBe(newAppointment.name);
    expect(appointments[0].startDate).toBe(newAppointment.startDate);
  });

  it("contains the items sent in Post request.", async () => {
    //given

    for (let i = 0; i < testcases.length; i++) {
      await request.post("/api/appointment").send(testcases[i]);
    }

    const response = await request.get("/api/appointment");
    const appointments = await Appointment.find();

    //then
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(appointments.length).toEqual(12);
    expect(response.body.length).toEqual(10);
  });

  it("Sends 10 items in response for simple get request.", async () => {
    //given

    const response = await request.get("/api/appointment");
    const appointments = await Appointment.find();

    //then
    //console.log(response.body);
    expect(response.status).toBe(200);
    expect(appointments.length).toEqual(12);
    expect(response.body.length).toEqual(10);
  });
});

describe("Checking responses for problematic POST requests", () => {
  it("Returns a meaningful response for an appointment in the past", async () => {
    //given
    const newAppointment = {
      name: "Éva",
      startTime: "2020-10-19T12:32",
      endTime: "2020-10-19T12:52",
    };

    //when
    const response = await request
      .post("/api/appointment")
      .send(newAppointment);

    //const appointments = await Appointment.findOne({});

    //then
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(`Appointment should be in the future.`);
  });

  it("Returns a meaningful response if time slot has already been booked.", async () => {
    //given
    const newAppointment = {
      name: "Fecó",
      startTime: "2021-10-19T12:32",
      endTime: "2021-10-19T12:52",
    };

    //when
    const response = await request
      .post("/api/appointment")
      .send(newAppointment);

    //const appointments = await Appointment.findOne({});

    //then
    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      `There is already a booking from ${newAppointment.startTime} to ${newAppointment.endTime}`
    );
  });
});

describe("GET requests for specific cases", () => {
  it("Sends 2 items in response to GET request when there are 12 objects in DB and page 2 is requested.", async () => {
    //given

    const response = await request.get("/api/appointment?page=2");
    const appointments = await Appointment.find();

    //then

    expect(response.status).toBe(200);
    expect(appointments.length).toEqual(12);
    expect(response.body.length).toEqual(2);
  });
});

describe("PATCH and DELETE cases", () => {
  it("Sends patch request.", async () => {
    //given
    const newAppointment = {
      name: "patchedÉva",
      startTime: "2023-10-19T12:32",
      endTime: "2023-10-19T12:52",
    };
    const response = await request
      .patch(`/api/appointment/${testID}`)
      .send(newAppointment);
    const appointments = await Appointment.find();

    //then

    expect(response.status).toBe(201);
    expect(appointments.length).toEqual(12);
  });

  it("Checks result of PATCH request.", async () => {
    //given
    //when
    const response = await request.get(`/api/appointment/${testID}`);

    //then

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("patchedÉva");
  });

  /* it("Checks if delete request deletes item from DB.", async () => {
    //given
    //when
    const response = await request.delete(`/api/appointment/${testID}`);
    const appointments = await Appointment.find();
    //then

    expect(response.status).toBe(204);
    expect(appointments.length).toEqual(11);
  })*/
});
