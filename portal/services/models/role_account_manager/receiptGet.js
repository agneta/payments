module.exports = function(Model) {

  Model.receiptGet = function(id, customerId) {

    return Model.projectModel('Role_Customer')
      .__receiptGet(id, customerId);

  };

  Model.remoteMethod(
    'receiptGet', {
      description: 'Get a receipt from a customer',
      accepts: [ {
        arg: 'id',
        type: 'string',
        required: true
      },{
        arg: 'customerId',
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
        path: '/receipt-get'
      }
    }
  );
};
