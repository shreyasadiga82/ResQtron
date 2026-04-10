const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String },
    age: { type: String },
    gender: { type: String },
    phone: { type: String },
    blood: { type: String },
    emergency: { type: String },
    severity: { type: String },
    location: { type: String },
    notes: { type: String },
    ambulanceId: { type: String },
    driver: { type: String },
    driverPhone: { type: String },
    eta: { type: Number },
    hospital: { type: String },
    timestamp: { type: String },
    status: { type: String },
    bookedBy: { type: String }
});

module.exports = mongoose.model('Booking', bookingSchema);
