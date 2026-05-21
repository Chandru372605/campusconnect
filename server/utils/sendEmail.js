const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.sendCollegeVerificationEmail = async user => {
  const verifyToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  const url = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/verify/${verifyToken}`;

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD }
  });

  await transporter.sendMail({
    from: `"CampusConnect" <${process.env.SMTP_EMAIL}>`,
    to: user.email,
    subject: "Verify your CampusConnect email",
    html: `<p>Please verify your account by <a href="${url}">clicking here</a>.</p>`
  });
};