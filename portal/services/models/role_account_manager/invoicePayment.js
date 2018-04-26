const _ = require('lodash');

module.exports = function(Model) {

  Model.invoicePayment = function(id,customerId, data) {

    data = _.pick(data,['method']);

    return Promise.resolve()
      .then(function(){
        return Model.projectModel('Role_Customer')
          .__invoiceGet(id, customerId);
      })
      .then(function(invoice){
        return invoice.updateAttributes(data);
      });


  };

  Model.remoteMethod(
    'invoicePayment', {
      description: 'Update a invoice',
      accepts: [{
        arg: 'id',
        type: 'string',
        required: true
      },{
        arg: 'customerId',
        type: 'string',
        required: true
      },  {
        arg: 'data',
        type: 'object',
        required: true
      }, {
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
        path: '/invoice-payment'
      }
    }
  );
};
