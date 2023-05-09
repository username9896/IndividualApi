const mongoose = require('mongoose');

module.exports = mongoose.model('securityDevice', new mongoose.Schema({
    id: String,
    room: String,
    devicename: String,
    state: String
}, { collection: 'SecurityDevices' }));
