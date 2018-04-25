module.exports = function(Model, app) {

  require('./receiptGet')(Model,app);
  require('./customerGet')(Model,app);

};
