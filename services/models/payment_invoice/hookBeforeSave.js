const Promise = require('bluebird');
const _ = require('lodash');

module.exports = function(Model) {

  Model.observe('before save', function(ctx) {

    var data = ctx.instance || ctx.data;

    return Promise.resolve()
      .then(function() {

        var stats = getStats(data);
        _.extend(data,stats);

      });

  });

  Model.__setStatus = function(options){
    return Promise.resolve()
      .then(function() {
        return Model.findById(options.id,{
          include: {
            relation: 'payments',
            scope:{
              fields: ['amount','status']
            }
          }
        });
      })
      .then(function(result){
        var stats = getStats(result.__data);
        return result.updateAttributes(stats);
      });
  };

  function getStats(data) {
    if(!data.payments || !data.amount){
      return;
    }

    var paidTotal = 0;
    for(var payment of data.payments){
      if(payment.status!='accepted'){
        continue;
      }
      paidTotal += payment.amount;
    }
    var status;

    if(data.amount>paidTotal){
      status = 'partial';
    }
    if(data.amount<paidTotal){
      status = 'over';
    }
    if(data.amount==paidTotal){
      status = 'full';
    }
    if(!paidTotal){
      status = 'none';
    }

    return{
      status: status,
      paidTotal: paidTotal
    };
  }



};
