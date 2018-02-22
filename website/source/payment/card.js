/*global braintree*/
var app = window.angular.module('MainApp');

app.service('PaymentCard',function($timeout, $mdDialog, Role_Customer) {

  this.init = function(options) {

    var vm = options.vm;
    var hostedFieldsInstance;
    var clientInstance;

    function init(){
      vm.loading = true;
      return Role_Customer.clientToken()
        .$promise
        .then(function(result){
          braintree.client.create({
            authorization:result.token
          }, function(err, _clientInstance) {
            clientInstance = _clientInstance;
            vm.loading = false;
            if (err) {
              console.error(err);
              return;
            }
            createHostedFields(clientInstance);
            $timeout();
          });
        });

    }

    init();

    function createHostedFields(clientInstance) {
      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '16px',
            'font-family': 'courier, monospace',
            'font-weight': 'lighter',
            'color': '#555'
          },
          ':focus': {
            'color': '#111'
          }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: 'MM/YYYY'
          }
        }
      }, function (err, _hostedFieldsInstance) {
        if(err){
          console.error(err);
          return;
        }
        hostedFieldsInstance = _hostedFieldsInstance;

        hostedFieldsInstance.on('validityChange', function (event) {
          console.log(event);
          var allValid = true;
          for (var key in event.fields) {

            var field = event.fields[key];

            angular.element(field.container).removeClass('invalid');
            angular.element(field.container).removeClass('valid');

            if (field.isValid === false) {
              allValid = false;
              angular.element(field.container).addClass('invalid');
            }

            if (field.isValid === true) {
              angular.element(field.container).addClass('valid');
            }
          }
          if(vm.isValid!=allValid){
            $timeout(function () {
              vm.isValid = allValid;
            }, 10);
          }

        });

        hostedFieldsInstance.on('cardTypeChange', function (event) {
          //console.log('cardTypeChange',event);
          // Change card bg depending on card type
          if (event.cards.length === 1) {

            var cardImage = angular.element(document.querySelector( '#card-image' ));
            cardImage.attr('class',event.cards[0].type);

            // Change the CVV length for AmericanExpress cards
            if (event.cards[0].code.size === 4) {
              hostedFieldsInstance.setAttribute({
                field: 'cvv',
                attribute: 'placeholder',
                value: '1234'
              });
            }
          } else {
            hostedFieldsInstance.setAttribute({
              field: 'cvv',
              attribute: 'placeholder',
              value: '123'
            });
          }
        });

      });


    }

    vm.submit = function() {

      vm.loading = true;

      hostedFieldsInstance.tokenize(function (err, payload) {

        if(err){
          console.error(err);
          $mdDialog.open({
            partial: 'error',
            nested: true,
            data: {
              title: 'Could not tokenize your request.',
              content: 'Error code: '+ err.code
            }
          });
          return;
        }

        options.onSubmit(payload)
          .finally(function(){

            hostedFieldsInstance.teardown(function () {
              init();
            });

            vm.loading = false;
          });
      });
    };

  };


});
