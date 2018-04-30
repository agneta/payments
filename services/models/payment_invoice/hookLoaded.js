const S = require('string');
module.exports = function(Model) {

  Model.observe('loaded', function(ctx) {
    var data = ctx.data;

    return Promise.resolve()
      .then(function() {

        if(!data){
          return;
        }
        if(ctx.options.updatedCode){
          return;
        }

        if(data.code){
          return;
        }

        if(!data.number || !data.prefix){
          return;
        }

        var number = S(data.number).padLeft(4,'0');
        data.code = `${data.prefix}-${number}`;

        return Model.replaceById(data.id,data,{
          updatedCode: true
        });

      });
  });
};
