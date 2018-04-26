module.exports = function(Model) {

  Model.invoiceGet = function(id) {

    return Model.projectModel('Role_Customer')
      .__invoiceGet(id);

  };

  Model.remoteMethod(
    'invoiceGet', {
      description: 'Get a invoice from a customer',
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
        path: '/invoice-get'
      }
    }
  );
};
