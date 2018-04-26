agneta.directive('AccountRoleCustomer',function($mdDialog,$location, Role_Account_Manager) {

  var vm = this;
  var shared = {
    $mdDialog: $mdDialog,
    $location: $location,
    vm: vm,
    Role_Account_Manager: Role_Account_Manager
  };

  require('account/customer/invoice.module')(shared);

  vm.$on('account-loaded',function(event, account){
    onAccount(account);
  });

  if(vm.viewAccount){
    onAccount();
  }

  vm.analytics = function(){

    vm.loading = true;
    Role_Account_Manager.customerAnalytics({
      id: vm.customer.id
    })
      .$promise
      .then(function(){
        return onAccount();
      });
  };

  function onAccount(account){
    //console.log(account);
    account = account || vm.viewAccount;
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
      })
      .finally(function() {
        vm.loading = false;
      });
  }

});
