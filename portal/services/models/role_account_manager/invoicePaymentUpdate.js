module.exports = function(Model) {

  Model.invoicePaymentUpdate = function(id, status){
    return Model.projectModel('PaymentMethod')
      .findById(id)
      .then(function(payment){
        return payment.updateAttributes({
          status: status
        });
      });
  };

  Model.remoteMethod(
    'invoicePaymentUpdate', {
      description: 'Cancel a payment invoice',
      accepts: [{
        arg: 'id',
        type: 'string',
        required: true
      },{
        arg: 'status',
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
        path: '/invoice-payment-update'
      }
    });

};
