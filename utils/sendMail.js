require('dotenv').config()
const Brevo = require('@getbrevo/brevo');
const axios = require('axios');

const apiInstance = new Brevo.TransactionalEmailsApi();

const apiKey = apiInstance.authentications['apiKey'];

apiKey.apiKey = process.env.BREVO_API_KEY;
 


exports.sendMail = async (details) => {
  try {

   await axios.post('https://api.brevo.com/v3/smtp/email', {
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: process.env.BREVO_SENDER_NAME },
    to: [{ email: details.email }],
    subject: details.subject,
    htmlContent: details.html
   }, {
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    }
   });

   console.log("Email sent successfully:", details.email);

  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}


// const Brevo = require("@getbrevo/brevo");
// require("dotenv").config();

// // Create API instance and authenticate
// const apiInstance = new Brevo.TransactionalEmailsApi();
// apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// exports.sendMail = async (to, subject, htmlContent) => {
//   try {
//     const sendSmtpEmail = new Brevo.SendSmtpEmail({
//       sender: { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL },
//       to: [{ email: to }],
//       subject: subject,
//       htmlContent: htmlContent,
//     });

//     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log("Email sent successfully:", response.messageId || response);
//   } catch (error) {
//     console.error("Error sending email:", error.response?.body || error.message);
//   }
// };