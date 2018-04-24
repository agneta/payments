module.exports = function(Model) {

  Model.me = function(req) {

    return Promise.resolve()
      .then(function() {
        return Model.findById(
          req.accessToken.roles.customer,
          {
            fields: {
              totalPaid_USD: true
            }
          });
      });

  };

  Model.remoteMethod(
    'me', {
      description: 'Get logged in customer details',
      accepts: [{
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
        verb: 'get',
        path: '/me'
      }
    }
  );
};
