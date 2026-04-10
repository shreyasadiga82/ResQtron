const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    location: { type: String },
    lat: { type: String },
    lng: { type: String },
    type: { type: String },
    victims: { type: String },
    description: { type: String },
    name: { type: String },
    phone: { type: String },
    timestamp: { type: String },
    reportedBy: { type: String }
});

module.exports = mongoose.model('Incident', incidentSchema);
