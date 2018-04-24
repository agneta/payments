module.exports = function(app) {

  var braintree = app.payment.braintree;
  var config = app.get('payment');

  app.payment.charge = function(options) {

    var account;
    var customer;
    var receipt;
    var transaction = {};
    var customerBraintree;
    var accountId = options.accountId || options.req.accessToken.userId;

    return Promise.resolve()
      .then(function() {
        return app.models.Account._roleAdd(accountId, 'customer');
      })
      .then(function(result) {
        customer = result.role;
        account = result.account;
      })
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

        if(!options.token){
          return;
        }

        var saleOptions = {
          amount: options.amount,
          customerId: customerBraintree.id,
          paymentMethodNonce: options.token,
          options: {
            submitForSettlement: true
          }
        };

        //console.log('saleOptions',saleOptions);

        return braintree.transaction.sale(saleOptions)
          .then(function(result){
            if(!result.success){
              return Promise.reject({
                statusCode: 400,
                title: 'Could not make the transaction',
                message: transaction.message
              });
            }

            transaction = result.transaction;
          });

      })
      .then(function() {

        return app.models.Payment_Receipt.create({
          transactionId: transaction.id,
          customerId: customer.id,
          gateway: 'braintree',
          amount: options.amount
        });

      })
      .then(function(_receipt) {

        receipt = _receipt;

        if(!transaction.id){
          return;
        }

        var emailDataTransaction = {
          amount: options.amount,
          createdAt: new Date(),
          currency: transaction.currencyIsoCode || config.currency
        };

        if(transaction.creditCard){
          emailDataTransaction.card = {
            ending: transaction.creditCard.last4,
            type: transaction.creditCard.cardType
          };
        }

        return app.loopback.Email.send({
          to: account.email,
          templateName: 'payment-receipt',
          data: {
            account: {
              email: account.email
            },
            transaction: emailDataTransaction,
            customer: customer
          },
          req: options.req
        });

      })
      .then(function() {
        return {
          transaction: transaction,
          receipt: receipt,
          customer: customer
        };
      });

  };

};
