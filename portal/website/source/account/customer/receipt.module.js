module.exports = function(shared) {

  var vm = shared.vm;
  var Role_Account_Manager = shared.Role_Account_Manager;
  var receipt = vm.receipt = {};

  vm.$watch('customer', function(customer) {
    if (!customer) {
      return;
    }
    receipt.paginator = {
      method: Role_Account_Manager.topupList,
      limits: [5, 10, 20],
      query: {
        customerId: vm.customer.id
      }
    };

  });

};
