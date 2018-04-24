module.exports = function(Model, app) {

  require('./hookLoaded')(Model,app);
  require('./hookBeforeSave')(Model,app);
  require('./charge')(Model,app);

};
