module.exports = function(Model) {

  Model.receiptGet = function(id) {

    return Model.projectModel('Role_Customer')
      .__receiptGet(id);

  };

  Model.remoteMethod(
    'receiptGet', {
      description: 'Get a receipt from a customer',
      accepts: [ {
        arg: 'id',
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
