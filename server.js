// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/Blog');
const Testimonial = require('./models/Testimonial');
const Event = require('./models/Event');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' folder

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// API Endpoints

// Blog Endpoints
app.post('/api/blog', async (req, res) => {
    const blog = new Blog(req.body);
    try {
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(400).json({ error: 'Failed to create blog post.' });
    }
});

app.get('/api/blog', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Failed to fetch blog posts.' });
    }
});

app.put('/api/blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(blog);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(400).json({ error: 'Failed to update blog post.' });
    }
});

app.delete('/api/blog/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ error: 'Failed to delete blog post.' });
    }
});

// Testimonial Endpoints
app.post('/api/testimonial', async (req, res) => {
    const testimonial = new Testimonial(req.body);
    try {
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(400).json({ error: 'Failed to create testimonial.' });
    }
});

app.get('/api/testimonial', async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials.' });
    }
});

app.put('/api/testimonial/:id', async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(testimonial);
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(400).json({ error: 'Failed to update testimonial.' });
    }
});

app.delete('/api/testimonial/:id', async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: 'Failed to delete testimonial.' });
    }
});

// Event Endpoints
app.post('/api/event', async (req, res) => {
    const event = new Event(req.body);
    try {
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ error: 'Failed to create event.' });
    }
});

app.get('/api/event', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events.' });
    }
});

app.put('/api/event/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ error: 'Failed to update event.' });
    }
});

app.delete('/api/event/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event.' });
    }
});


app.post('/analytics', (req, res) => {
    console.log(req.body); // Process the metrics here.
    res.status(200).send('Metrics received');
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
