var braintree = require('braintree');

module.exports = function(app) {
  app.payment = {};

  var privateKey = app.secrets.get('braintree');
  if(!privateKey){
    throw new Error('Braintree privateKey is required to enable payments');
  }

  var config = app.get('payment');
  if(!config.currency){
    throw new Error('Currency must be provided');
  }

  app.payment.braintree = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: config.braintree.merchantId,
    publicKey: config.braintree.publicKey,
    privateKey: privateKey
  });

  require('./payment/charge')(app);
};
