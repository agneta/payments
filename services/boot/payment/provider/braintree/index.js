module.exports = function(app) {

  app.payment.braintree = {};

  require('./charge')(app);
  require('./connect')(app);

};
