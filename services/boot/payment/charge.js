
module.exports = function(app) {

  var braintree = app.payment.braintree;

  app.payment.charge = function(options) {

    var account;
    var receipt;
    var customer;
    var transaction;
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
        return customer.updateAttribute('braintreeId', customerBraintree.id);
      })
      .then(function() {
        var saleOptions = {
          amount: options.amount,
          customerId: customerBraintree.id,
          paymentMethodNonce: options.token,
          options: {
            submitForSettlement: true
          }
        };

        //console.log('saleOptions',saleOptions);

        return braintree.transaction.sale(saleOptions);

      })
      .then(function(result) {

        if(!result.success){
          return Promise.reject({
            statusCode: 400,
            title: 'Could not make the transaction',
            message: transaction.message
          });
        }

        transaction = result.transaction;

        //console.log('transaction',transaction);

        return app.models.Payment_Receipt.create({
          transactionId: transaction.id,
          customerId: customer.id,
          gateway: 'braintree',
          amount: transaction.amount,
          currency: transaction.currencyIsoCode
        });
      })
      .then(function(_receipt) {

        receipt = _receipt;

        return app.loopback.Email.send({
          to: account.email,
          templateName: 'payment-receipt',
          data: {
            account: {
              email: account.email
            },
            transaction: {
              amount: transaction.amount,
              cardEnding: transaction.creditCard.last4,
              cardType: transaction.creditCard.cardType,
              createdAt: transaction.createdAt,
              currency: transaction.currencyIsoCode
            },
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
