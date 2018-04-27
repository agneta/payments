const Promise = require('bluebird');

module.exports = function(Model) {

  Model.observe('loaded', function(ctx) {

    var data = ctx.instance || ctx.data;

    return Promise.resolve()
      .then(function() {

        if(data.customerId){
          return;
        }
        if(!data.invoiceId){
          return;
        }

        return Model.getModel('Payment_Invoice')
          .findById(data.invoiceId,{
            fields:{
              customerId: true
            }
          })
          .then(function(invoice) {
            data.customerId = invoice.customerId;

            if(ctx.instance){
              return ctx.instance.updateAttributes({
                customerId: data.customerId
              });
            }
            if(!data.id){
              return;
            }
            return Model.upsertWithWhere({
              id:data.id},{
              customerId: data.customerId
            });

          });

      });

  });



};
