const Promise = require('bluebird');

module.exports = function(Model) {

  Model.customerAnalytics = function(id) {

    return Promise.all([
      Model.projectModel('Payment_Invoice').__totals(id),
      Model.projectModel('Payment_Method').__totals(id)
    ])
      .then(function() {
        return {
          message: 'Analytics complete'
        };
      });

  };

  Model.remoteMethod(
    'customerAnalytics', {
      description: 'Analyze customer stats',
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
        path: '/customer-analytics'
      }
    }
  );
};
