var cc = require('currency-codes');

module.exports = function(app) {

  var config = app.get('payment');
  if(!config.currency){
    throw new Error('Currency must be provided');
  }

  var currency = cc.code(config.currency);
  if(!currency){
    throw new Error(`Not a valid currency: ${config.currency}`);
  }

  app.payment = {
    currency: currency
  };

  require('./payment/provider')(app);
  require('./payment/charge')(app);
};
