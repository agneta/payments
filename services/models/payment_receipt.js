const moment = require('moment');
const Promise = require('bluebird');
const S = require('string');

module.exports = function(Model, app) {

  Model.observe('loaded', function(ctx) {

    var data = ctx.instance || ctx.data;

    return Promise.resolve()
      .then(function() {
        var number = S(data.number).padLeft(4,'0');
        data.code = `${data.prefix}-${number}`;
      });

  });


  Model.observe('before save', function(ctx) {

    var data = ctx.instance || ctx.data;
    var braintree = app.payment.braintree.client;

    return Promise.resolve()
      .then(function() {

        var prefix = moment().format('YY-MM-DD');

        if (data.prefix && data.number) {
          return;
        }

        return Model.count({
          prefix: prefix
        })
          .then(function(count) {
            count = count || 0;

            data.number = count + 1;
            data.prefix = prefix;
            //console.log('before save payment receipt', data);
          });
      })
      .then(function() {

        return Model.find({
          fields:{
            transactionId: true
          },
          where:{
            customerId: data.customerId
          }
        })
          .then(function(receipts){

            var totalPaid = {};
            //console.log('receipts',results);
            return Promise.map(receipts,function(receipt) {
              if(!receipt.transactionId){
                return;
              }
              return braintree.transaction.find(receipt.transactionId)
                .then(function(result){
                  if(!result){
                    throw new Error(`transaction not found in braintree with id: ${receipt.transactionId}`);
                  }
                  var total = totalPaid[result.currencyIsoCode] || 0;
                  total += parseFloat(result.amount);
                  totalPaid[result.currencyIsoCode] = total;
                });
            },{
              concurrency: 10
            })
              .then(function(){
                return {
                  totalPaid: totalPaid
                };
              });
          });

      })
      .then(function(result) {
        var fields = {};
        for(var key in result.totalPaid){
          fields[`totalPaid_${key}`] = result.totalPaid[key];
        }
        return app.models.Role_Customer.upsertWithWhere({
          id: data.customerId
        },fields);
      });
  });

};
