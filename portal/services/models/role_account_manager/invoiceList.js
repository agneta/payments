module.exports = function(Model) {

  Model.invoiceList = function(customerId, req) {

    return Model.projectModel('Role_Customer')
      .__invoiceList({
        req: req,
        customerId: customerId,
      });

  };

  Model.remoteMethod(
    'invoiceList', {
      description: 'Get invoices from customer',
      accepts: [ {
        arg: 'customerId',
        type: 'string',
        required: true
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
        path: '/invoice-list'
      }
    }
  );
};
