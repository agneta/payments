const Promise = require('bluebird');

module.exports = function(Model) {

  Model.observe('after save', function(ctx) {

    var data = ctx.instance || ctx.data;

    return Promise.resolve()
      .then(function() {

        return Model.getCollection()
          .aggregate([{
            $match:{
              customerId: data.customerId
            }
          },
          {
            $group:{
              _id: {
                method: '$method',
                currency: '$currency'
              },
              totalAmount: {
                $sum: '$amount'
              }
            }
          }])
          .toArray()
          .then(function(values){
            console.log(values);
            var result = {};
            for(var value of values){
              let key = value._id.method || 'none';
              let currency = value._id.currency;
              if(!currency){
                continue;
              }
              result[key] = result[key] || {};
              result[key][currency] = value.totalAmount;
            }

            return Model.getModel('Role_Customer')
              .upsertWithWhere({
                id: data.customerId
              },{
                paidTotal: result
              });
          });

      });
  });
};
