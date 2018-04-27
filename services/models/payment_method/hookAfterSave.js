module.exports = function(Model, app) {

  Model.observe('after save',function(ctx){
    var data = ctx.instance || ctx.data;
    return Model.__totals(data.customerId);
  });

  Model.__totals = function(customerId){
    return app.payment.totalsMethod({
      model: Model,
      customerId: customerId,
      query:{
        status: 'accepted'
      },
      prop: 'paymentTotals'
    });
  };

};
