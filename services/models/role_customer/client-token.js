module.exports = function(Model, app) {

  Model.clientToken = function(){
    return Promise.resolve()
      .then(function () {
        return app.payment.braintree.clientToken.generate();
      })
      .then(function (response) {
        return {
          token: response.clientToken
        };
      });
  };

  Model.remoteMethod(
    'clientToken', {
      description: 'Get client token for a checkout session',
      accepts: [],
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      },
      http: {
        verb: 'get',
        path: '/client-token'
      }
    }
  );

};
