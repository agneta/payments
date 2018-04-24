module.exports = function(Model, app) {

  Model.receiptList = function(req) {

    var count;

    return Promise.resolve()
      .then(function() {
        return app.models.Payment_Receipt.count({
          customerId: req.accessToken.roles.customer
        });
      })
      .then(function(_count) {
        count = _count;
        return app.models.Payment_Receipt.find({
          where:{
            customerId: req.accessToken.roles.customer
          },
          fields:{
            number: true,
            code: true,
            id: true,
            prefix: true,
            createdAt: true
          },
          limit: 20
        });
      })
      .then(function(list) {
        return {
          list: list,
          count: count
        };
      });

  };

  Model.remoteMethod(
    'receiptList', {
      description: 'Get receipts from customer',
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
        verb: 'post',
        path: '/receipt-list'
      }
    }
  );
};
