var braintree = require('braintree');

module.exports = function(app) {

  var privateKey = app.secrets.get('braintree');
  if(!privateKey){
    throw new Error('Braintree privateKey is required to enable payments');
  }

  var config = app.get('payment');

  app.payment.braintree.client = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: config.braintree.merchantId,
    publicKey: config.braintree.publicKey,
    privateKey: privateKey
  });

};
