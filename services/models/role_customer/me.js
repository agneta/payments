module.exports = function(Model) {

  Model.me = function(req) {

    return Model.__get({
      id: req.accessToken.roles.customer
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
