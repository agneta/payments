module.exports = function(Model, app) {

  require('./invoiceGet')(Model,app);
  require('./invoiceList')(Model,app);
  require('./invoicePaymentAdd')(Model,app);
  require('./invoicePaymentCancel')(Model,app);

  require('./customerGet')(Model,app);
  require('./customerAnalytics')(Model,app);

};
