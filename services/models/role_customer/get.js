const _ = require('lodash');

module.exports = function(Model) {

  Model.__get = function(options) {
    return Promise.resolve()
      .then(function() {

        return Model.findOne({
          where:{
            id: options.id,
            accountId: options.accountId
          },
          fields:{
            id: true,
            invoiceTotals: true,
            paymentTotals: true
          }
        });
      })
      .then(function(result) {

        var remainingTotals = {
          values: []
        };

        for(let invoiceValue of result.invoiceTotals.values){

          let paymentValue =  _.find(result.paymentTotals.values,
            {_id:invoiceValue._id}
          ) || {amount:0};

          remainingTotals.values.push({
            _id: invoiceValue._id,
            amount: invoiceValue.amount - paymentValue.amount
          });
        }

        result.remainingTotals = remainingTotals;

        if(!result){
          return Promise.reject({
            statusCode: 401,
            message: 'Customer not found. Check the id you supplied.'
          });
        }
        return result;
      });

  };
};
