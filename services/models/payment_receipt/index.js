module.exports = function(Model, app) {

  require('./hookLoaded')(Model,app);
  require('./hookBeforeSave')(Model,app);
  require('./hookAfterSave')(Model,app);
  require('./charge')(Model,app);

};
