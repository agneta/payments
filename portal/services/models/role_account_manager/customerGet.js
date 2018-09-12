module.exports = function(Model) {

  Model.customerGet = function(accountId) {

    return Model.projectModel('Role_Customer')
      .__get({
        accountId: accountId
      });

  };

  Model.remoteMethod(
    'customerGet', {
      description: 'Get customer details',
      accepts: [ {
        arg: 'accountId',
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
