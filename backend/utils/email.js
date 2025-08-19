import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send admission acceptance email
export const sendAcceptanceEmail = async (studentData) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .credentials { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Congratulations!</h1>
          <h2>Your Admission Has Been Approved</h2>
        </div>
        <div class="content">
          <p>Dear <strong>${studentData.name}</strong>,</p>
          
          <p>We are delighted to inform you that your admission application has been <strong>approved</strong>! Welcome to Janashiri Institute.</p>
          
          <div class="credentials">
            <h3>Your Login Credentials:</h3>
            <p><strong>Student ID:</strong> ${studentData.student_id}</p>
            <p><strong>Password:</strong> ${studentData.password}</p>
            <p><strong>Login URL:</strong> <a href="${process.env.FRONTEND_URL}/login">Student Portal</a></p>
          </div>
          
          <p><strong>Important Instructions:</strong></p>
          <ul>
            <li>Please login to your student portal using the credentials above</li>
            <li>Change your password after first login for security</li>
            <li>Complete your profile information</li>
            <li>Download your student ID card from the dashboard</li>
          </ul>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <a href="${process.env.FRONTEND_URL}/login" class="button">Login to Student Portal</a>
          
          <div class="footer">
            <p>Best regards,<br>
            <strong>Janashiri Institute</strong><br>
            Email: ${process.env.EMAIL_FROM}<br>
            Website: ${process.env.FRONTEND_URL}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: studentData.email,
    subject: '🎉 Admission Approved - Welcome to Janashiri Institute',
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Acceptance email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending acceptance email:', error);
    throw new Error('Failed to send acceptance email');
  }
};

// Send admission rejection email
export const sendRejectionEmail = async (studentData, reason) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .reason-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ff6b6b; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Admission Application Update</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${studentData.name}</strong>,</p>
          
          <p>Thank you for your interest in Janashiri Institute. After careful review of your application, we regret to inform you that we are unable to offer you admission at this time.</p>
          
          <div class="reason-box">
            <h3>Reason for Rejection:</h3>
            <p>${reason}</p>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>You may reapply in the next admission cycle</li>
            <li>Consider addressing the areas mentioned in the feedback</li>
            <li>Contact us if you need clarification on requirements</li>
          </ul>
          
          <p>We appreciate your interest in our institution and wish you all the best in your educational journey.</p>
          
          <a href="${process.env.FRONTEND_URL}/admission" class="button">Apply Again</a>
          
          <div class="footer">
            <p>Best regards,<br>
            <strong>Janashiri Institute</strong><br>
            Email: ${process.env.EMAIL_FROM}<br>
            Website: ${process.env.FRONTEND_URL}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: studentData.email,
    subject: 'Admission Application Update - Janashiri Institute',
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw new Error('Failed to send rejection email');
  }
};

// Send contact form response email
export const sendContactResponseEmail = async (contactData, response) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .original-message { background: #e9ecef; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .response { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Response to Your Inquiry</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${contactData.name}</strong>,</p>
          
          <p>Thank you for contacting Janashiri Institute. We have reviewed your inquiry and are pleased to provide the following response:</p>
          
          <div class="original-message">
            <h4>Your Original Message:</h4>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p>${contactData.message}</p>
          </div>
          
          <div class="response">
            <h4>Our Response:</h4>
            <p>${response}</p>
          </div>
          
          <p>If you need further assistance, please don't hesitate to contact us.</p>
          
          <div class="footer">
            <p>Best regards,<br>
            <strong>Janashiri Institute</strong><br>
            Email: ${process.env.EMAIL_FROM}<br>
            Website: ${process.env.FRONTEND_URL}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: contactData.email,
    subject: `Re: ${contactData.subject}`,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact response email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact response email:', error);
    throw new Error('Failed to send contact response email');
  }
};

// Send student login credentials email
export const sendStudentCredentialsEmail = async (email, studentName, studentId, password) => {
  // Validate required parameters
  if (!email || !studentName || !studentId || !password) {
    throw new Error('Missing required parameters for sending credentials email');
  }

  const transporter = createTransporter();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .credentials { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Your Login Credentials</h1>
          <h2>Janashiri Institute Student Portal</h2>
        </div>
        <div class="content">
          <p>Dear <strong>${studentName}</strong>,</p>
          
          <p>Your login credentials for the Janashiri Institute Student Portal have been generated. Please use the following details to access your account:</p>
          
          <div class="credentials">
            <h3>Login Details:</h3>
            <p><strong>Student ID:</strong> ${studentId}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 3px; font-family: monospace;">${password}</code></p>
          </div>

          <div class="warning">
            <strong>⚠️ Important Security Notice:</strong>
            <ul style="margin: 10px 0;">
              <li>Please change your password after your first login</li>
              <li>Do not share your credentials with anyone</li>
              <li>Use your email or Student ID to log in</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/student/login" class="button">
              Login to Student Portal
            </a>
          </div>
          
          <h3>What you can do in the portal:</h3>
          <ul>
            <li>View and update your profile</li>
            <li>Download your student ID card</li>
            <li>Check your admission status</li>
            <li>Update contact information</li>
          </ul>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <div class="footer">
            <p><strong>Janashiri Institute</strong></p>
            <p>Email: support@janashiri.edu | Phone: +91-XXXXXXXXXX</p>
            <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🔐 Your Student Portal Login Credentials - Janashiri Institute',
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Student credentials email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending student credentials email:', error);
    throw new Error('Failed to send student credentials email');
  }
};
