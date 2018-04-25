module.exports = function(Model, app) {

  Model.receiptList = function(req) {

    return Model.__receiptList({
      req: req,
      customerId: req.accessToken.roles.customer,
    });

  };

  Model.__receiptList = function(options){

    if(!options.customerId){
      return Promise.reject('Member id is required');
    }

    return app.finder.paginate({
      req: options.req,
      model: Model.getModel('Payment_Receipt'),
      max: 50,
      filter: {
        where:{
          customerId: options.customerId
        },
        fields:{
          code: true,
          id: true,
          amount: true,
          createdAt: true
        },
        limit: 6,
        order: 'createdAt DESC'
      }
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
