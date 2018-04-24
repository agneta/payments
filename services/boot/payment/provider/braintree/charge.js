module.exports = function(app){

  app.payment.braintree.charge = function(options){

    var braintree = app.payment.braintree.client;
    var customer = options.customer;
    var account = options.account;
    var amount = options.amount;
    var token = options.token;

    var customerBraintree;

    if(!token){
      return;
    }

    return Promise.resolve()
      .then(function() {

        if (!customer.braintreeId) {
          return braintree.customer.create({
            email: account.email
          });
        }

        return braintree.customer.find(customer.braintreeId);
      })
      .then(function(_customerBraintree) {
        customerBraintree = _customerBraintree.customer || _customerBraintree;
        //console.log('customerBraintree',customerBraintree);
        if(!customerBraintree){
          throw new Error(`Could not find a braintree customer with id: ${customer.braintreeId}`);
        }
        if (customer.braintreeId == customerBraintree.id) {
          return;
        }
        return customer.updateAttribute(
          'braintreeId',
          customerBraintree.id);
      })
      .then(function() {

        var saleOptions = {
          amount: amount,
          customerId: customerBraintree.id,
          paymentMethodNonce: token,
          options: {
            submitForSettlement: true
          }
        };

        //console.log('saleOptions',saleOptions);

        return braintree.transaction.sale(saleOptions);
      })
      .then(function(result){

        if(!result.success){
          return Promise.reject({
            statusCode: 400,
            title: 'Could not make the transaction',
            message: result.transaction.message
          });
        }

        return{
          gateway: 'braintree',
          transaction: result.transaction
        };

      });
  };
};
