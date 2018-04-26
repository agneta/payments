module.exports = function(shared) {

  var vm = shared.vm;
  var $mdDialog = shared.$mdDialog;
  var Role_Account_Manager = shared.Role_Account_Manager;
  var invoice = vm.invoice = {};

  vm.$watch('customer', function(customer) {
    if (!customer) {
      return;
    }
    invoice.paginator = {
      method: Role_Account_Manager.invoiceList,
      limits: [5, 10, 20],
      query: {
        customerId: vm.customer.id
      }
    };

  });

  invoice.details = function(item){
    $mdDialog.open({
      partial: 'payment-invoice',
      data: {
        id: item.id,
        customerId: vm.viewAccount.roles.customer.id
      }
    });
  };

};
