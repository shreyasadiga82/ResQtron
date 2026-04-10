const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    emergency: { type: String },
    severity: { type: String },
    location: { type: String },
    notes: { type: String },
    phone: { type: String },
    assignedAmbulance: { type: String },
    timestamp: { type: String }
});

module.exports = mongoose.model('Patient', patientSchema);
