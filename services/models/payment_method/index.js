module.exports = function(Model, app) {

  require('./hookAfterSave')(Model,app);
  require('./hookLoaded')(Model,app);

};
