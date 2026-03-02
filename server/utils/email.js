import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

// Ensure dotenv is loaded
dotenv.config();

// Create transporter with better error handling
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  console.log('📧 Email Utility - Checking credentials...');
  console.log('   EMAIL_USER:', emailUser ? `✅ ${emailUser}` : '❌ Not set');
  console.log('   EMAIL_PASS:', emailPass ? `✅ Set (${emailPass.length} chars)` : '❌ Not set');
  
  if (!emailUser || !emailPass) {
    console.log('⚠️  Email credentials not configured. Emails will be skipped.');
    return null;
  }

  console.log('✅ Email transporter created successfully!');
  
  return createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

const transporter = createTransporter();

export const sendBookingConfirmation = async (booking) => {
  try {
    if (!transporter) {
      console.log('📧 Email not configured. Skipping booking confirmation email.');
      return;
    }

    // Get user info (either from user object or guest fields)
    const userName = booking.isGuestBooking ? booking.guestName : booking.user?.name;
    const userEmail = booking.isGuestBooking ? booking.guestEmail : booking.user?.email;

    if (!userEmail) {
      console.log('⚠️  No email address found for booking. Skipping email.');
      return;
    }

    const checkIn  = new Date(booking.checkIn).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const nights   = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))
    const numberOfRooms = booking.numberOfRooms || 1;

    // Status display logic
    const statusDisplay = {
      pending: { text: 'Pending Confirmation', color: '#F59E0B', emoji: '⏳' },
      confirmed: { text: 'Confirmed', color: '#10B981', emoji: '✅' },
      'checked-in': { text: 'Checked In', color: '#3B82F6', emoji: '🏨' },
      'checked-out': { text: 'Checked Out', color: '#6B7280', emoji: '👋' },
      cancelled: { text: 'Cancelled', color: '#EF4444', emoji: '❌' }
    };
    
    const status = statusDisplay[booking.status] || statusDisplay.pending;
    const isPending = booking.status === 'pending';

    console.log('📧 Sending booking confirmation to:', userEmail);

    const mailOptions = {
      from: `"DAISY DALE 🏡" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `${status.emoji} Booking ${isPending ? 'Received' : status.text} — ${booking.bookingId} | DAISY DALE`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#F5EFE6;font-family:Georgia,serif;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#7B1C2E 0%,#5a1422 100%);padding:40px 30px;text-align:center;">
    <div style="font-size:13px;letter-spacing:6px;color:#F2A830;text-transform:uppercase;margin-bottom:10px;">❖ ❖ ❖</div>
    <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:normal;letter-spacing:2px;">DAISY DALE</h1>
    <div style="font-size:11px;letter-spacing:4px;color:#F2A830;text-transform:uppercase;margin-top:6px;">Dehradun Mountain Homestay</div>
  </div>

  <!-- Confirmation Banner -->
  <div style="background:${isPending ? '#F59E0B' : '#E8721C'};padding:20px 30px;text-align:center;">
    <div style="font-size:28px;margin-bottom:6px;">${isPending ? '⏳' : '🙏'}</div>
    <h2 style="margin:0;color:#ffffff;font-size:20px;font-weight:normal;letter-spacing:1px;">${isPending ? 'Booking Request Received!' : 'Booking Confirmed!'}</h2>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;font-family:Arial,sans-serif;">
      ${isPending 
        ? `Dhanyavaad, ${userName}! We've received your booking request and will confirm within 24 hours.`
        : `Dhanyavaad, ${userName}! We are delighted to welcome you.`
      }
    </p>
  </div>

  <!-- Main Content -->
  <div style="max-width:600px;margin:0 auto;padding:30px 20px;">

    <!-- Booking ID Card -->
    <div style="background:#7B1C2E;border-radius:8px;padding:16px 24px;text-align:center;margin-bottom:24px;">
      <div style="font-size:11px;letter-spacing:4px;color:#F2A830;text-transform:uppercase;font-family:Arial,sans-serif;">Booking Reference</div>
      <div style="font-size:22px;color:#ffffff;letter-spacing:3px;margin-top:6px;font-family:'Courier New',monospace;">${booking.bookingId}</div>
    </div>

    <!-- Booking Details -->
    <div style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);margin-bottom:24px;">
      <div style="background:#FDF6EC;padding:16px 24px;border-bottom:2px solid #F0E6D0;">
        <h3 style="margin:0;color:#7B1C2E;font-size:16px;letter-spacing:1px;">📋 Booking Details</h3>
      </div>
      <div style="padding:0 24px;">
        ${[
          ['🏛 Room',       `${booking.room.name}${numberOfRooms > 1 ? ` × ${numberOfRooms}` : ''}`],
          ['🏠 Rooms',      `${numberOfRooms} room${numberOfRooms > 1 ? 's' : ''}`],
          ['📅 Check-in',   checkIn],
          ['📅 Check-out',  checkOut],
          ['🌙 Nights',     `${nights} night${nights > 1 ? 's' : ''}`],
          ['👥 Guests',     `${booking.guests} Adult${booking.guests > 1 ? 's' : ''}`],
          ['💰 Total',      `₹${booking.totalPrice.toLocaleString('en-IN')}`],
          [status.emoji + ' Status', `<span style="color:${status.color};font-weight:bold;">${status.text}</span>`],
        ].map(([label, value]) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #F5EFE6;">
            <span style="color:#8B7355;font-size:13px;font-family:Arial,sans-serif;">${label}</span>
            <span style="color:#2C1810;font-size:14px;font-weight:bold;font-family:Arial,sans-serif;text-align:right;max-width:60%;">${value}</span>
          </div>
        `).join('')}
      </div>
    </div>

    ${isPending ? `
    <!-- Pending Notice -->
    <div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:16px 20px;margin-bottom:24px;border-radius:4px;">
      <p style="margin:0;color:#92400E;font-size:13px;font-family:Arial,sans-serif;line-height:1.6;">
        <strong>⏳ Awaiting Confirmation:</strong><br/>
        Your booking request has been received. Our team will review availability and confirm your booking within 24 hours. You'll receive another email once confirmed.
      </p>
    </div>
    ` : ''}

    <!-- What's Included -->
    <div style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);margin-bottom:24px;">
      <div style="background:#FDF6EC;padding:16px 24px;border-bottom:2px solid #F0E6D0;">
        <h3 style="margin:0;color:#7B1C2E;font-size:16px;letter-spacing:1px;">🎁 What's Included</h3>
      </div>
      <div style="padding:16px 24px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          ${['🍳 Daily Homemade Breakfast','🚗 Airport / Station Pickup','🏔 Nature Walks & Mountain Views','📶 Free WiFi','🧹 Daily Housekeeping','🛎 24/7 Host Support'].map(item => `
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#5C4A32;font-family:Arial,sans-serif;padding:6px 0;">${item}</div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div style="background:linear-gradient(135deg,#7B1C2E,#5a1422);border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
      <h3 style="margin:0 0 12px;color:#F2A830;font-size:15px;letter-spacing:1px;">Need Help?</h3>
      <p style="margin:0 0 16px;color:rgba(255,255,255,0.8);font-size:13px;font-family:Arial,sans-serif;">Our host family is available 7AM – 10PM daily</p>
      <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;">
        <a href="tel:+919876543210" style="background:#E8721C;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;font-size:13px;font-family:Arial,sans-serif;">📞 Call Us</a>
        <a href="https://wa.me/919876543210" style="background:#25D366;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;font-size:13px;font-family:Arial,sans-serif;">💬 WhatsApp</a>
        <a href="mailto:info@havelistay.in" style="background:#ffffff22;color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;font-size:13px;font-family:Arial,sans-serif;border:1px solid rgba(255,255,255,0.3);">✉️ Email</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px 0;">
      <div style="font-size:11px;letter-spacing:4px;color:#E8721C;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:8px;">❖ ❖ ❖</div>
      <p style="margin:0;color:#8B7355;font-size:12px;font-family:Arial,sans-serif;">DAISY DALE · Dehradun Foothills, Uttarakhand, India</p>
      <p style="margin:6px 0 0;color:#B0967A;font-size:11px;font-family:Arial,sans-serif;">info@daisydale.in · +91 91295 86522</p>
    </div>

  </div>
</body>
</html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

// Send contact form notification to owner
export const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  try {
    if (!transporter) {
      console.log('📧 Email not configured. Skipping contact notification.');
      return;
    }

    await transporter.sendMail({
      from: `"DAISY DALE" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact: ${subject || 'General'} — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#FDF6EC;padding:30px;border-radius:8px;">
          <h2 style="color:#7B1C2E;border-bottom:2px solid #E8721C;padding-bottom:10px;">New Message from Website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject || 'General'}</p>
          <div style="background:#fff;padding:16px;border-left:4px solid #E8721C;border-radius:4px;margin-top:10px;">
            <p style="margin:0;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `
    });
    console.log('✅ Contact email sent to owner');
  } catch (error) {
    console.error('❌ Error sending contact email:', error.message);
  }
};
