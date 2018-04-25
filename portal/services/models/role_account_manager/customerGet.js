module.exports = function(Model) {

  Model.customerGet = function(id) {

    return Model.projectModel('Role_Customer')
      .__get(id);

  };

  Model.remoteMethod(
    'customerGet', {
      description: 'Get customer details',
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
        path: '/customer-get'
      }
    }
  );
};
