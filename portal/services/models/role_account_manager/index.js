module.exports = function(Model, app) {

  require('./invoiceGet')(Model,app);
  require('./invoiceList')(Model,app);
  require('./invoicePayment')(Model,app);

  require('./customerGet')(Model,app);

};
