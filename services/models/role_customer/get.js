module.exports = function(Model) {

  Model.__get = function(id) {
    return Promise.resolve()
      .then(function() {

        return Model.findById(id,{
          fields:{
            id: true,
            invoiceTotals: true,
            paymentTotals: true
          }
        });
      })
      .then(function(result) {
        if(!result){
          return Promise.reject({
            statusCode: 401,
            message: `Customer not found. Check the id you supplied: ${id}`
          });
        }
        return result;
      });

  };
};
