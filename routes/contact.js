const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();
const Contact = require('../models/Contact');

// Create a new contact message
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('message').notEmpty().withMessage('Message is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contact = new Contact(req.body);
        try {
            await contact.save();

            // Send email notification
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: contact.email,
                to: process.env.EMAIL_USER,
                subject: `New Contact Message from ${contact.name}`,
                text: contact.message,
            };

            await transporter.sendMail(mailOptions);

            res.status(201).json(contact);
        } catch (error) {
            res.status(400).json({ error: 'Failed to send message.' });
        }
    }
);

// Get all contact messages
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contact messages.' });
    }
});

// Update a contact message status
router.put('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) {
            return res.status(404).json({ error: 'Contact message not found.' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update contact message.' });
    }
});

// Delete a contact message
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact message not found.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact message.' });
    }
});

module.exports = router;