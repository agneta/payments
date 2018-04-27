module.exports = function(Model) {

  Model.invoiceGet = function(id, req) {

    var customerId = req.accessToken.roles.customer;

    if(!customerId){
      return Promise.reject({
        statusCode: 400,
        message: 'Customer ID is required'
      });
    }

    return Model.__invoiceGet(id, customerId);
  };

  Model.__invoiceGet = function(id,customerId){

    return Promise.resolve()
      .then(function(){
        return  Model.getModel('Payment_Invoice').findById(id,{
          include:['items',{
            relation: 'payments',
            scope:{
              fields: ['type','amount','createdAt','id','status']
            }
          }],
          fields:{
            id: true,
            code: true,
            paymentStatus: true,
            paidTotal: true,
            amount: true,
            currency: true,
            createdAt: true
          },
          where:{
            customerId: customerId
          }
        });
      })
      .then(function(invoice){
        if(!invoice){
          return Promise.reject({
            statusCode: 404,
            message: 'Invoice not found'
          });
        }
        return invoice;
      });
  };

  Model.remoteMethod(
    'invoiceGet', {
      description: '',
      accepts: [{
        arg: 'id',
        type: 'string',
        required: true,
      },{
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
        path: '/invoice-get'
      }
    }
  );


};
