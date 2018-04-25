module.exports = function(Model, app) {

  require('./client-token')(Model, app);
  require('./me')(Model, app);
  require('./get')(Model, app);

  require('./receiptGet')(Model, app);
  require('./receiptList')(Model, app);

};
