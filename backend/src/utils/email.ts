import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Notes App - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p style="color: #666; font-size: 16px;">Hello,</p>
        <p style="color: #666; font-size: 16px;">
          Thank you for signing up for our Notes App! To complete your registration, 
          please use the following verification code:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f0f0f0; padding: 15px 25px; font-size: 24px; 
                       font-weight: bold; color: #333; border-radius: 5px; letter-spacing: 3px;">
            ${otp}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this verification, 
          please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
