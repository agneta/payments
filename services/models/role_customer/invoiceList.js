module.exports = function(Model, app) {

  Model.invoiceList = function(req) {

    return Model.__invoiceList({
      req: req,
      customerId: req.accessToken.roles.customer,
    });

  };

  Model.__invoiceList = function(options){

    if(!options.customerId){
      return Promise.reject('Member id is required');
    }

    return app.finder.paginate({
      req: options.req,
      model: Model.getModel('Payment_Invoice'),
      max: 50,
      filter: {
        include:{
          relation: 'payments',
          scope:{
            fields: ['amount']
          }
        },
        where:{
          customerId: options.customerId
        },
        fields:{
          code: true,
          paymentStatus: true,
          id: true,
          amount: true,
          currency: true,
          createdAt: true
        },
        limit: 6,
        order: 'createdAt DESC'
      }
    });

  };

  Model.remoteMethod(
    'invoiceList', {
      description: 'Get invoices from customer',
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
        path: '/invoice-list'
      }
    }
  );
};
