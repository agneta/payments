module.exports = function(app) {

  var currency = app.payment.currency;

  app.payment.charge = function(options) {

    var accountId = options.accountId || options.req.accessToken.userId;
    var token = options.token;
    var amount = options.amount;

    var account = null;
    var customer = null;
    var receipt = null;
    var charge = null;

    return Promise.resolve()
      .then(function() {
        return app.models.Account._roleAdd(accountId, 'customer');
      })
      .then(function(result) {
        customer = result.role;
        account = result.account;
      })
      .then(function() {

        return app.payment.braintree.charge({
          customer: customer,
          account: account,
          token: token,
          amount: amount
        });

      })
      .then(function(_charge) {
        charge = _charge || {
          transaction: {}
        };

        return app.models.Payment_Receipt.create({
          transactionId: charge.transaction.id,
          customerId: customer.id,
          gateway: charge.gateway,
          amount: options.amount,
          currency: currency.code
        });

      })
      .then(function(_receipt) {

        receipt = _receipt;

        if(!charge.transaction.id){
          return;
        }

        var emailDataTransaction = {
          amount: options.amount,
          createdAt: new Date(),
          currency: currency.code
        };

        if(charge.transaction.creditCard){
          emailDataTransaction.card = {
            ending: charge.transaction.creditCard.last4,
            type: charge.transaction.creditCard.cardType
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
          transaction: charge.transaction,
          receipt: receipt,
          customer: customer
        };
      });

  };

};
