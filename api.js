/**
* @swagger
* components:
*   schema:
*     SecurityDevices:
*       type: object
*       properties:
*         room:
*           type: string
*         devicename:
*           type: string
*         state:
*           type: string
* 
* @swagger
* /api/securitydevices:
*  get:
*      title: Sensor Data API's
*      summary: To get the sensor data
*      description: This API is used for fetching the data from MongoDB
*      responses:
*          200:
*              description: Successfully loaded the data
*              content:
*                  application/json:
*                      schema:
*                          type: array
*                          items:
*                              $ref: '#/components/schema/SecurityDevices'
*/

/**
* @swagger
* components:
*   schema:
*     LightDevices:
*       type: object
*       properties:
*         room:
*           type: string
*         devicename:
*           type: string
*         state:
*           type: string
* 
* @swagger
* /api/lightdevices:
*  get:
*      title: Sensor Data API's
*      summary: To get the sensor data
*      description: This API is used for fetching the data from MongoDB
*      responses:
*          200:
*              description: Successfully loaded the data
*              content:
*                  application/json:
*                      schema:
*                          type: array
*                          items:
*                              $ref: '#/components/schema/LightDevices'
*/

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://vicky4830:vicky111@cluster0.lmsnl7w.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
const express = require('express');
const Device = require('./models/device');
const SecurityDevice = require('./models/device1');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const bodyParser = require('body-parser');
const device = require('./models/device');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const base = `${__dirname}/public`;
app.use(express.static('public'));

const port = 5000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Active Sense",
      version: "0.1.0",
    },
    servers: [
      {
        url: "https://individualapidata.onrender.com",
      },
    ],
  },
  apis: ["./*.js"],
};

const specs = swaggerjsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});

app.get('/api/lightdevices', (req, res) => {
  Device.find({}, (err, lightdevices) => {
    if (err == true) {
      return res.send(err);
    } else {
      return res.send(lightdevices);
    }
  });
});

app.get('/api/securitydevices', (req, res) => {
  SecurityDevice.find({}, (err, securitydevices) => {
    if (err == true) {
      return res.send(err);
    } else {
      return res.send(securitydevices);
    }
  });
});

app.post('/api/lightdevices', (req, res) => {
  const { room, devicename, state, color } = req.body;
  const newDevice = new Device({
    room,
    devicename,
    state,
    color
  });
  newDevice.save(err => {
    return err
      ? res.send(err)
      : res.send('successfully added device and data');
  });
});

app.post('/api/updatedevices', async (req, res) => {
  const { room, state, color } = req.body;

  const check = { room: room };
  const update = { state: state, color: color };

  try {
    const result = await Device.findOneAndUpdate(check, update).exec();
    return res.send('successfully updated device state');
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred');
  }
});

app.post('/api/securitydevices', (req, res) => {
  const { room, devicename, state } = req.body;
  const newDevice = new SecurityDevice({
    room,
    devicename,
    state
  });
  newDevice.save(err => {
    return err
      ? res.send(err)
      : res.send('successfully added device and data');
  });
});

app.post('/api/updatesecuritydevices', (req, res) => {
  const { room, devicename, state } = req.body;

  const check = { room: room };
  const update = { state: state };

  try {
    const result = SecurityDevice.findOneAndUpdate(check, update).exec();
    return res.send('successfully added device and data');
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

app.post('/api/removelightdevices', async (req, res) => {
  const { room, devicename } = req.body;

  const query = { room, devicename };

  try {
    const result = await Device.findOneAndRemove(query);
    return res.send('successfully removed device and data');
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

app.post('/api/removesecuritydevices', async (req, res) => {
  const { room, devicename } = req.body;

  const query = { room, devicename };

  try {
    const result = await SecurityDevice.findOneAndRemove(query);
    return res.send('successfully removed device and data');
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});