module.exports = function(Model) {

  Model.invoicePaymentCancel = function(invoiceId){
    return Model.projectModel('PaymentMethod')
      .findById(invoiceId)
      .then(function(payment){
        return payment.updateAttributes({
          status: 'cancelled'
        });
      });
  };

  Model.remoteMethod(
    'invoicePaymentCancel', {
      description: 'Cancel a payment invoice',
      accepts: [{
        arg: 'invoiceId',
        type: 'string',
        required: true
      }],
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      },
      http: {
        verb: 'post',
        path: '/invoice-payment-cancel'
      }
    });

};
