const Promise = require('bluebird');
const S = require('string');
const _ = require('lodash');
module.exports = function(Model) {

  Model.observe('loaded', function(ctx) {

    var data = ctx.instance || ctx.data;

    return Promise.resolve()
      .then(function() {

        if(data.payments && data.amount){

          var totalAmount = _.sumBy(data.payments,'amount');
          var paymentStatus;

          if(data.amount>totalAmount){
            paymentStatus = 'partial';
          }
          if(data.amount<totalAmount){
            paymentStatus = 'over';
          }
          if(data.amount==totalAmount){
            paymentStatus = 'full';
          }
          if(!totalAmount){
            paymentStatus = 'none';
          }

          data.paymentStatus = paymentStatus;
          data.paidTotal = totalAmount;
        }
        if(data.number){
          var number = S(data.number).padLeft(4,'0');
          data.code = `${data.prefix}-${number}`;
        }
      });

  });



};
