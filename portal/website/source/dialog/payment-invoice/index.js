agneta.directive('PaymentInvoice',function(data,Role_Account_Manager, $mdDialog) {

  var vm = this;
  agneta.extend(vm, 'AgDialogCtrl');

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

  vm.removePayment = function(){

    Role_Account_Manager.invoicePaymentRemove({
      id: data.id
    })
      .then(function(){
        return load();
      });

  };

  vm.addPayment = function(){
    $mdDialog.open({
      nested: true,
      partial: 'payment-add',
      data:{
        invoiceId: data.id,
        onSubmit: function(){
          load();
        }
      }
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
