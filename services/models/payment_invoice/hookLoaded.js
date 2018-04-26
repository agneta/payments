const Promise = require('bluebird');
const S = require('string');

module.exports = function(Model) {

  Model.observe('loaded', function(ctx) {

    var data = ctx.instance || ctx.data;

    return Promise.resolve()
      .then(function() {
        if(!data.method){
          data.method = 'none';
        }
        if(data.number){
          var number = S(data.number).padLeft(4,'0');
          data.code = `${data.prefix}-${number}`;
        }
      });

  });



};
