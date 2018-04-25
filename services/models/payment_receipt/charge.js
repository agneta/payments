const Promise = require('bluebird');

module.exports = function(Model, app) {

  Model.charge = function(options) {

    var currency = app.payment.currency;

    var Account = Model.getModel('Account');
    var Payment_Receipt = Model.getModel('Payment_Receipt');
    var Payment_Receipt_Item = Model.getModel('Payment_Receipt_Item');

    var accountId = options.accountId || options.req.accessToken.userId;
    var token = options.token;
    var amount = parseFloat(options.amount);
    var items = options.items;

    var account = null;
    var customer = null;
    var receipt = null;
    var charge = null;
    var method = null;
    var list = null;

    if(amount<=0){
      return Promise.reject({
        message: `Amount (${amount}) needs to be large than 0`
      });
    }

    return Promise.resolve()
      .then(function() {

        var priceTotal = 0;

        return Promise.map(items, function(item) {
          return Promise.resolve()
            .then(function() {

              return Model.getModel('Payment_Item')
                .findOne({
                  where:{
                    code: item.code
                  },
                  fields: {
                    id: true,
                    price: true
                  }
                })
                .then(function(result) {

                  if (!result) {
                    return Promise.reject({
                      statusCode: 400,
                      message: 'Could not find receipt item'
                    });
                  }

                  if (!item.quantity) {
                    return Promise.reject({
                      statusCode: 400,
                      message: 'Item has no quantity'
                    });
                  }

                  priceTotal += item.quantity * result.price;

                  return Payment_Receipt_Item.create({
                    itemId: result.id,
                    description: item.description,
                    discount: item.discount,
                    quantity: item.quantity,
                    price: result.price
                  });

                });
            });
        })
          .then(function(_list) {
            list = _list;
            if (priceTotal != amount) {
              return Promise.reject({
                statusCode: 400,
                message: `The items total price (${priceTotal}) does not match the requested amount (${amount})`
              });
            }
          });

      })
      .then(function() {
        return Account._roleAdd(accountId, 'customer');
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

        if (_charge) {
          method = 'card';
        }

        charge = _charge || {
          transaction: {}
        };

        return Payment_Receipt.create({
          transactionId: charge.transaction.id,
          customerId: customer.id,
          gateway: charge.gateway,
          method: method,
          itemList: list,
          amount: amount,
          currency: currency.code
        });

      })
      .then(function(_receipt) {

        receipt = _receipt;

        if (!charge.transaction.id) {
          return;
        }

        var emailDataTransaction = {
          amount: amount,
          createdAt: new Date(),
          currency: currency.code
        };

        if (charge.transaction.creditCard) {
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
