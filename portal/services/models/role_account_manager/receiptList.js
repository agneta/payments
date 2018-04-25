module.exports = function(Model) {

  Model.receiptList = function(customerId, req) {

    return Model.projectModel('Role_Customer')
      .__receiptList({
        req: req,
        customerId: customerId,
      });

  };

  Model.remoteMethod(
    'receiptList', {
      description: 'Get receipts from customer',
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
        path: '/receipt-list'
      }
    }
  );
};
