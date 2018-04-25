agneta.directive('PaymentReceipt',function(data,Role_Account_Manager) {

  var vm = this;

  vm.editMethod = function(name){
    Role_Account_Manager
      .receiptUpdate({
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
      .receiptGet({
        id: data.id,
        customerId: data.customerId
      })
      .$promise
      .then(function(result){
        vm.receipt = result;
      });
  }

  load();

});
