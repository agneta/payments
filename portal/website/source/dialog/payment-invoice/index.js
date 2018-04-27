agneta.directive('PaymentInvoice',function(data,Role_Account_Manager,$timeout,$rootScope, $templateRequest, $compile, $mdDialog, $mdMenu) {

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

  var paymentSelected;
  $templateRequest('payment-menu.html').then(function(html) {

    var template = angular.element(
      $compile(html)(vm)
    );

    var menuCtrl = {
      open: function(event) {
        $mdMenu.show({
          scope: $rootScope.$new(),
          mdMenuCtrl: menuCtrl,
          element: template,
          target: event.target
        });
      },

      close: function() {
        $mdMenu.hide();
      },
      positionMode: function() {
        return {
          left: 'target',
          top: 'target'
        };
      },
      offsets: function() {
        return {
          left: event.offsetX,
          top: event.offsetY
        };
      }
    };

    vm.paymentOptions =function(payment, event) {
      paymentSelected = payment;
      menuCtrl.open(event);
    };

  });


  vm.paymentUpdate = function(status){
    console.log(paymentSelected, status);
    Role_Account_Manager.invoicePaymentUpdate({
      id: paymentSelected.id,
      status: status
    })
      .$promise
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
