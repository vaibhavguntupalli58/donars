const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Loads .env file content into process.env

// Import Mongoose Models
const Donation = require('./models/donation.model');
const User = require('./models/user.model');

// --- Express App Setup ---
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing JSON in request bodies

// --- MongoDB Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- Authentication Middleware ---
// This function will verify the user's token
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload to the request object
    req.user = decoded.user;
    next(); // Move to the next piece of middleware/route
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// --- API ROUTES ---

// 1. User Registration
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({ username, password });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create and return JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// 2. User Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and return JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// 3. Submit Donation Form (Protected Route)
app.post('/api/donations', authMiddleware, async (req, res) => {
  const { name, age, gender, bloodGroup, weight, phone } = req.body;

  // --- Server-side validation ---
  if (age < 18) {
    return res.status(400).json({ msg: "You aren't eligible to give blood (under 18)." });
  }
  if (weight < 60) {
    return res.status(400).json({ msg: "You aren't eligible to give blood (under 60kg)." });
  }

  try {
    const newDonation = new Donation({
      name,
      age,
      gender,
      bloodGroup,
      weight,
      phone,
      donatedBy: req.user.id // Get user ID from the auth middleware
    });

    const donation = await newDonation.save();
    res.json({
      msg: 'Thanks for filling data, You are eligible to donate!',
      donation
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 4. Get Total Donation Count
app.get('/api/donations/count', async (req, res) => {
  try {
    const count = await Donation.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 5. Get Recent Donors
app.get('/api/donations/recent', async (req, res) => {
  try {
    // Get donations from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentDonors = await Donation.find({ createdAt: { $gte: oneWeekAgo } })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(20); // Get max 20
    
    // We only want to show names
    const donorNames = recentDonors.map(donor => donor.name);
    // Remove duplicate names
    const uniqueNames = [...new Set(donorNames)]; 

    res.json(uniqueNames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

