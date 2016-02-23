var mongoose = require('mongoose');
var cfg = require('../config');
var twilio = require('twilio');

var OrderSchema = new mongoose.Schema({
  customerName:String,
  customerPhoneNumber: String,
  status : { type: String, default: 'Ready' },
  notificationStatus : { type: String, default: 'None' },
});

OrderSchema.methods.sendSmsNotification = function (message, statusCallback , callback) {

  var client = new twilio.RestClient(cfg.twilioAccountSid, cfg.twilioAuthToken);

  var options = {
      to:  this.customerPhoneNumber,
      from: cfg.twilioPhoneNumber,
      body: message,
      statusCallback: statusCallback
  };

  client.sendMessage(options, function(err, response) {
      if (err) {
          console.error(err);
      } else {
          var masked = this.customerPhoneNumber.substr(0,
            customerPhoneNumber.length - 5);
          masked += '*****';
          console.log('Message sent to ' + masked);
      }
  });

  if (callback) {
    callback.call(this);
  }
};

var Order = mongoose.model('order', OrderSchema);
module.exports = Order;
