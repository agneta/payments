module.exports = function(Model, app) {

  require('./client-token')(Model, app);
  require('./me')(Model, app);
  require('./get')(Model, app);

  require('./invoiceGet')(Model, app);
  require('./invoiceList')(Model, app);

};
