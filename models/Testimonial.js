const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5 }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);