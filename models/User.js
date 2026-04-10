const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'patient'], default: 'patient' },
    fullname: { type: String },
    email: { type: String },
    phone: { type: String },
    blood: { type: String },
    bookings: [{ type: String }] // Array of booking IDs
});

module.exports = mongoose.model('User', userSchema);
