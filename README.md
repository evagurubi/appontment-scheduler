# Appointment scheduler

## Overview

The task was to create an application, but only the backend of it and test the various endpoints.

The service is an appointment scheduler service with all the prerequisites. One appointment must not be longer than 30 minutes. The appointments can be patched or deleted.

### Tests

Every endpoint is tested using the 'given-when-then' pattern.
Supertest, jest and the mongodb-memory-server package are used.

## Technologies

The project was created using:

- Node.js v12.18.2
- express.js 4.17.1
- MongoDB
