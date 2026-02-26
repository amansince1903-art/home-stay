import express from 'express';
import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required'
      })
    }

    // Save to MongoDB
    const contact = new Contact({ name, email, phone, subject, message })
    await contact.save()

    // Send email (only if EMAIL_USER is set)
    if (process.env.EMAIL_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      })

      await transporter.sendMail({
        from: `"Haveli Stay" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Contact: ${subject || 'General'} — ${name}`,
        html: `
          <h3>New message from ${name}</h3>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || 'Not provided'}</p>
          <p><b>Subject:</b> ${subject || 'General'}</p>
          <p><b>Message:</b> ${message}</p>
        `
      })
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!'
    })

  } catch (error) {
    console.error('Contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, data: contacts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router;
