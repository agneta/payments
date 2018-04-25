
const moment = require('moment');
const Promise = require('bluebird');

module.exports = function(Model) {

  Model.observe('before save', function(ctx) {

    var data = ctx.instance || ctx.data;

    return Promise.resolve()
      .then(function() {

        var prefix = moment().format('YY-MM-DD');

        if (data.prefix && data.number) {
          return;
        }

        return Model.count({
          prefix: prefix
        })
          .then(function(count) {
            count = count || 0;

            data.number = count + 1;
            data.prefix = prefix;
            //console.log('before save payment receipt', data);
          });

      });
  });
};
