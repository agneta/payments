const S = require('string');
module.exports = function(Model) {

  Model.observe('loaded', function(ctx) {
    var data = ctx.instance || ctx.data;

    return Promise.resolve()
      .then(function() {

        if(data.code){
          return;
        }

        if(!data.number || !data.prefix){
          return;
        }

        var number = S(data.number).padLeft(4,'0');
        data.code = `${data.prefix}-${number}`;

        return Promise.resolve()
          .then(function() {
            if(ctx.instance){
              return ctx.instance.updateAttributes({
                code: data.code
              });
            }
            if(!data.id){
              return;
            }
            return Model.upsertWithWhere({
              id:data.id},{
              code: data.code
            });
          });

      });
  });
};
