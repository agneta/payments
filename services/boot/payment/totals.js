const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');
module.exports = function(app) {

  app.payment.totalsMethod = function(options){

    var Model = options.model;
    var prop = options.prop;
    var customerId = options.customerId;

    if(!customerId){
      return;
    }
    var result = {};

    return Promise.resolve()
      .then(function() {

        return Model.getCollection()
          .aggregate([{
            $match:{
              customerId: ObjectID(customerId)
            }
          },
          {
            $group:{
              _id: '$currency',
              amount: {
                $sum: '$amount'
              },
              count:{
                $sum: 1
              }
            }
          }])
          .toArray()
          .then(function(values){
            result.values = values;
            result.count = _.sumBy(values,'count');
            return Model.getModel('Role_Customer')
              .findById(customerId);
          })
          .then(function(customer){
            var attrs = {};
            attrs[prop] = result;
            return customer.updateAttributes(attrs);
          });

      });
  };
};
