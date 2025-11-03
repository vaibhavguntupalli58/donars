const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for storing donation form submissions
const donationSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  weight: { type: Number, required: true },
  phone: { type: String, required: true },
  // Link the donation to the user who submitted it
  donatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;

