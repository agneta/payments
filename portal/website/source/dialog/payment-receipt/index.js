agneta.directive('PaymentReceipt',function(data,Role_Account_Manager) {

  console.log(data);

  Role_Account_Manager
    .receiptGet({
      id: data.id,
      customerId: data.customer.id
    })
    .$promise
    .then(function(result){
      console.log(result);
    });

});
