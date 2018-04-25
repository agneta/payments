const _ = require('lodash');

module.exports = function(Model) {

  Model.receiptUpdate = function(id,customerId, data) {

    data = _.pick(data,['method']);

    return Promise.resolve()
      .then(function(){
        return Model.projectModel('Role_Customer')
          .__receiptGet(id, customerId);
      })
      .then(function(receipt){
        return receipt.updateAttributes(data);
      });


  };

  Model.remoteMethod(
    'receiptUpdate', {
      description: 'Update a receipt',
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
        path: '/receipt-update'
      }
    }
  );
};
