require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS to bypass local ECONNREFUSED issues

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const User = require('./models/User');
const Booking = require('./models/Booking');
const Incident = require('./models/Incident');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = 'mongodb+srv://shreyasadiga82_db_user:1970@cluster0.j2mzzvh.mongodb.net/resqtron?appName=Cluster0';

mongoose.connect(MONGO_URI, {
    family: 4, // Force IPv4 to bypass Windows DNS SRV issues
    serverSelectionTimeoutMS: 5000 // Don't hang forever
})
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    await seedDefaultAdmins();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Seed Default Admins
async function seedDefaultAdmins() {
  const defaultAdmins = [
    { username: 'shreyasadiga82@gmail.com', password: '19701970.aA', role: 'admin', fullname: 'Shreyas Adiga', email: 'shreyasadiga82@gmail.com', phone: '+91 99999 00001' },
    { username: 'sidharthr@gmail.com', password: '19831983.aA', role: 'admin', fullname: 'Sidharth R', email: 'sidharthr@gmail.com', phone: '+91 99999 00003' },
    { username: 'shobithugowda@gmail.com', password: '19831983.aA', role: 'admin', fullname: 'Shobith Gowda', email: 'shobithugowda@gmail.com', phone: '+91 99999 00002' },
    { username: 'sivoham@gmail.com', password: '19831983.aA', role: 'admin', fullname: 'Sivoham', email: 'sivoham@gmail.com', phone: '+91 99999 00004' }
  ];

  for (const admin of defaultAdmins) {
    const exists = await User.findOne({ username: admin.username });
    if (!exists) {
      await User.create(admin);
      console.log(`Created admin: ${admin.username}`);
    } else {
        // Ensure role and password are correct
        await User.updateOne({ username: admin.username }, { $set: { role: 'admin', password: admin.password } });
    }
  }
}

// ================= API ROUTES =================

// Users
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username } = req.body;
        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ success: false, message: 'Username taken' });

        const user = await User.create(req.body);
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:username', async (req, res) => {
    try {
        await User.deleteOne({ username: req.params.username });
        // Optionally delete bookings for the user as well
        await Booking.deleteMany({ bookedBy: req.params.username });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const booking = await Booking.create(req.body);
        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Incidents
app.get('/api/incidents', async (req, res) => {
    try {
        const incidents = await Incident.find();
        res.json(incidents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/incidents', async (req, res) => {
    try {
        const incident = await Incident.create(req.body);
        res.json({ success: true, incident });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
