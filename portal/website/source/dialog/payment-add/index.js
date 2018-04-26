agneta.directive('PaymentAdd',function(Role_Account_Manager,data) {
  var vm = this;
  agneta.extend(vm, 'AgDialogCtrl');

  vm.add = function() {

    Role_Account_Manager.invoicePaymentAdd({
      type: vm.type,
      amount: vm.amount,
      invoiceId: data.invoiceId
    })
      .$promise
      .then(function(){
        vm.close();
        data.onSubmit();
      });

  };

});
