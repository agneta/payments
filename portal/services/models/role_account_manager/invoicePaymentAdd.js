var cc = require('currency-codes');

module.exports = function(Model, app) {

  var paymentTypes = {
    card: true,
    cash: true
  };
  var webServices = app.web.services;

  Model.invoicePaymentAdd = function(
    invoiceId,
    type,
    amount,
    currencyCode) {

    if (amount <= 0) {
      return Promise.reject({
        statusCode: 400,
        message: `Amount (${amount}) must be larger than 0.`
      });
    }

    var typeDetails = paymentTypes[type];
    if (!typeDetails) {
      return Promise.reject({
        statusCode: 400,
        message: `Invalid payment type: ${type}`
      });
    }

    currencyCode = currencyCode || webServices.payment.currency.code;
    var currency = cc.code(currencyCode);
    if (!currency) {
      return Promise.reject({
        statusCode: 400,
        message: `Not a valid currency: ${currency}`
      });
    }

    return Promise.resolve()
      .then(function() {
        return Model.projectModel('Payment_Invoice')
          .findById(invoiceId);
      })
      .then(function(invoice) {
        console.log(invoice);
        if(!invoice){
          return Promise.reject({
            statusCode: 404,
            message: 'Invoice not found'
          });
        }
        return invoice.payments.create({
          type: type,
          amount: amount,
          currency: currency.code
        });
      });


  };

  Model.remoteMethod(
    'invoicePaymentAdd', {
      description: 'Update a invoice',
      accepts: [{
        arg: 'invoiceId',
        type: 'string',
        required: true
      }, {
        arg: 'type',
        type: 'string',
        required: true
      }, {
        arg: 'amount',
        type: 'number',
        required: true
      },{
        arg: 'currency',
        type: 'string',
        required: false
      }, {
        arg: 'req',
        type: 'object',
        'http': {
          source: 'req'
        }
      }],
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      },
      http: {
        verb: 'post',
        path: '/invoice-payment-add'
      }
    }
  );
};
