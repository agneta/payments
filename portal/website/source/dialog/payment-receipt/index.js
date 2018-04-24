agneta.directive('PaymentReceipt',function(data,Role_Account_Manager) {

  var vm = this;
  
  Role_Account_Manager
    .receiptGet({
      id: data.id,
      customerId: data.customerId
    })
    .$promise
    .then(function(result){
      console.log(result);
      vm.receipt = result;
    });

});
