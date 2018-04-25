agneta.directive('AccountRoleCustomer',function($mdDialog,$location, Role_Account_Manager) {

  var vm = this;
  var shared = {
    $mdDialog: $mdDialog,
    $location: $location,
    vm: vm,
    Role_Account_Manager: Role_Account_Manager
  };

  require('account/customer/receipt.module')(shared);

  vm.$on('account-loaded',function(event, account){
    onAccount(account);
  });

  if(vm.viewAccount){
    onAccount(vm.viewAccount);
  }

  function onAccount(account){
    //console.log(account);
    var customer = account.roles.customer;

    if(!customer){
      return;
    }
    vm.loading = true;

    Role_Account_Manager.customerGet({
      id: customer.id
    })
      .$promise
      .then(function(result){
        vm.customer = result;
      });
  }

});
