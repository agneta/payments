module.exports = function(Model) {

  Model.receiptGet = function(id, req) {
    return Model.__receiptGet(id, req.accessToken.roles.customer);
  };

  Model.__receiptGet = function(id,customerId){
    if(!customerId){
      return Promise.reject({
        statusCode: 400,
        message: 'Customer ID is required'
      });
    }
    return Promise.resolve()
      .then(function(){
        return  Model.getModel('Payment_Receipt').findById(id,{
          where:{
            customerId: customerId
          }
        });
      })
      .then(function(topup){
        if(!topup){
          return Promise.reject({
            statusCode: 404,
            message: 'Topup not found'
          });
        }
        return topup;
      });
  };

  Model.remoteMethod(
    'receiptGet', {
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
        path: '/receipt-get'
      }
    }
  );


};
