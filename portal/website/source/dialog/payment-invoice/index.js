agneta.directive('PaymentInvoice',function(data,Role_Account_Manager) {

  var vm = this;

  vm.editMethod = function(name){
    Role_Account_Manager
      .invoiceUpdate({
        id: data.id,
        customerId: data.customerId,
        data:{
          method: name
        }
      })
      .$promise
      .then(function() {
        return load();
      });
  };

  function load() {
    Role_Account_Manager
      .invoiceGet({
        id: data.id,
        customerId: data.customerId
      })
      .$promise
      .then(function(result){
        vm.invoice = result;
      });
  }

  load();

});
