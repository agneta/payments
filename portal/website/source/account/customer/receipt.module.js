module.exports = function(shared) {

  var vm = shared.vm;
  var $mdDialog = shared.$mdDialog;
  var Role_Account_Manager = shared.Role_Account_Manager;
  var receipt = vm.receipt = {};

  vm.$watch('customer', function(customer) {
    if (!customer) {
      return;
    }
    receipt.paginator = {
      method: Role_Account_Manager.receiptList,
      limits: [5, 10, 20],
      query: {
        customerId: vm.customer.id
      }
    };

  });

  receipt.details = function(item){
    $mdDialog.open({
      partial: 'payment-receipt',
      data: {
        id: item.id,
        customerId: vm.viewAccount.roles.customer.id
      }
    });
  };

};
