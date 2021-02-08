const mongoose = require('mongoose');
const config = require('../config');
const twilio = require('twilio');
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(config.sendgridApiKey);

const OrderSchema = new mongoose.Schema({
  customerName: String,
  customerPhoneNumber: String,
  status: {type: String, default: 'Ready'},
  notificationStatus: {type: String, default: 'None'},
  customerEmail: String,
});

OrderSchema.methods.sendSmsNotification = function(message, statusCallback) {
  if (!statusCallback) {
    throw new Error('status callback is required to send notification.');
  }

  const client = twilio(config.twilioAccountSid, config.twilioAuthToken);
  const options = {
    to: this.customerPhoneNumber,
    from: config.twilioPhoneNumber,
    body: message,
    statusCallback: statusCallback,
  };

  return client.messages.create(options)
    .then((message) => {
      console.log('Message sent to ' + message.to);
    });
};

OrderSchema.methods.sendEmailNotification = function(message) {
  const options = {
    to: this.customerEmail,
    from: config.sendgridEmail,
    subject: 'Your Laundr.io order',
    text: `Dear ${this.customerName},\n\n${message}\n\nFrom the Laundr.io team`
  };
  return sendgrid.send(options).then(() => {
    console.log('Email sent to ' + this.customerEmail);
  });
}


const Order = mongoose.model('order', OrderSchema);
module.exports = Order;
