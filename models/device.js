const mongoose = require('mongoose');

module.exports = mongoose.model('Device', new mongoose.Schema({
    id: String,
    room: String,
    devicename: String,
    state: String,
    color: String
}, { collection: 'LightDevices' }));
