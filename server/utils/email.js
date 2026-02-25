import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendBookingConfirmation = async (booking) => {
  try {
    if (!process.env.EMAIL_USER) {
      console.log('Email not configured. Skipping email send.');
      console.log('Booking details:', {
        bookingId: booking.bookingId,
        guest: booking.user.name,
        room: booking.room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      });
      return;
    }

    const mailOptions = {
      from: `Haveli Stay <${process.env.EMAIL_USER}>`,
      to: booking.user.email,
      subject: `Booking Confirmation - ${booking.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E8721C;">Booking Confirmation</h2>
          <p>Dear ${booking.user.name},</p>
          <p>Your booking has been confirmed! Here are the details:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Room:</strong> ${booking.room.name}</p>
            <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>
          
          <p>We look forward to welcoming you to Haveli Stay!</p>
          <p>For any queries, contact us at +91 98765 43210</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Haveli Stay, Hazratganj, Lucknow, UP 226001
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to:', booking.user.email);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};
