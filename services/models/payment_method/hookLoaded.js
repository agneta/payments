const Promise = require('bluebird');

module.exports = function(Model) {

  Model.observe('loaded', function(ctx) {

    var data = ctx.data;

    return Promise.resolve()
      .then(function() {

        if(!data){
          return;
        }

        if(!data.id){
          return;
        }

        if(ctx.options.updatedCustomer){
          return;
        }

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

            return Model.replaceById(data.id,data,{
              updatedCustomer: true
            });

          });

      });

  });



};
