const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// GET: /orders
router.get('/', function(_req, res) {
  Order.find().then(function(orders) {
    res.render('orders/index', {orders});
  });
});

// GET: /orders/4
router.get('/:id/show', function(req, res) {
  const id = req.params.id;
  Order.findOne({_id: id}).then(function(order) {
    res.render('orders/show', {order: order});
  });
});

// POST: /orders/4/pickup
router.post('/:orderId/pickup', function(req, res) {
  const id = req.params.orderId;

  Order.findOne({_id: id}).then(function(order) {
    order.status = 'Shipped';
    order.notificationStatus = 'Queued';

    order.save()
      .then(function() {
        const message = 'Your clothes will be sent and will be delivered in 20 minutes'
        return Promise.all([
          order.sendSmsNotification(message, getCallbackUri(req)),
          order.sendEmailNotification(message)
        ]);
      })
      .then(function() {
        res.redirect(`/orders/${id}/show`);
      })
      .catch(function(err) {
        res.status(500).send(err.message);
      });
  });
});

// POST: /orders/4/deliver
router.post('/:orderId/deliver', function(req, res) {
  const id = req.params.orderId;

  Order.findOne({_id: id})
    .then(function(order) {
      order.status = 'Delivered';
      order.notificationStatus = 'Queued';
      order.save()
        .then(function() {
          const message = 'Your clothes have been delivered';
          return Promise.all([
            order.sendSmsNotification(message, getCallbackUri(req)),
            order.sendEmailNotification(message)
          ]);
        })
        .then(function() {
          res.redirect(`/orders/${id}/show`);
        })
        .catch(function(err) {
          res.status(500).send(err.message);
        });
    })
});


// POST: /orders/4/status/update
router.post('/:orderId/status/update', function(req, res) {
  const id = req.params.orderId;

  const notificationStatus = req.body.MessageStatus;

  Order.findOne({_id: id})
    .then(function(order) {
      order.notificationStatus = notificationStatus.charAt(0).toUpperCase() + notificationStatus.slice(1);
      return order.save();
    })
    .then(function() {
      res.sendStatus(200);
    })
    .catch(function(err) {
      res.status(500).send(err.message);
    });
});

function getCallbackUri(req) {
  return `http://${req.headers.host}/orders/${req.params.orderId}/status/update`;
};

module.exports = router;
