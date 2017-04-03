var ATM = angular.module("my-app", ["ngRoute", "ngMaterial", "my-card-reader", "my-cash-dispenser", "my-receipt-printer", "treasure-overlay-spinner","my-cash-depositor"]);

ATM.controller("homeCtrl", homeCtrl);

ATM.service('ATM', function() {
    return {};
});

ATM.config(function ($mdThemingProvider, $routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('httpErrorResponseInterceptor');

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

    $routeProvider.when('/',
        {
            templateUrl: 'Home/Home'
        })
        .when('/authenticate', { templateUrl: 'BSL/Index' })
        .when('/main', { templateUrl: 'BSL/Main' })
        .when('/withdraw', { templateUrl: 'BSL/Withdraw' })
        .when('/deposit', { templateUrl: 'BSL/Deposit' })
        .when('/balance', {templateUrl: 'BSL/Balance'})
        .when('/chooseamount', { templateUrl: 'BSL/ChooseAmount' })
        .when('/choosedeposit', { templateUrl: 'BSL/ChooseDeposit' })
        .when('/finish', { templateUrl: 'BSL/Finish' })
        .when('/viewbalance', {templateUrl: 'BSL/CheckBalance'})
        .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode(false).hashPrefix("!");
});

ATM.factory('ATMUi',function($http) {
    return {
        authenticateCard: function (data) {
            return $http.post('/BSL/Authenticate', { CardNumber: data.number, Pin: data.pin });
        },
        choosenAccount: function(data) {
            return $http.post('/BSL/Account', {Account: data.Account});
        },
        withdrawAmount: function(data) {
            return $http.post('/BSL/Withdraw', { Amount: data.Amount, Status: data.Status});
        },
        depositAmount: function(data) {
            return $http.post('/BSL/Deposit', { Amount: data.Amount });
        }
    };
});

ATM.factory('httpErrorResponseInterceptor', ['$q', '$location',
  function ($q, $location) {
      return {
          response: function (responseData) {
              return responseData;
          },
          responseError: function error(response) {
              switch (response.status) {
                  case 401:
                      $location.path('/');
                      break;
                  case 404:
                      $location.path('/');
                      break;
                  default:
                      $location.path('/');
              }

              return $q.reject(response);
          }
      };
  }
]);

function homeCtrl($scope, ATM, CARDREADERService, $location, ATMUi, $http, $window, Dispenser, Printer, $mdDialog, Depositor, $templateCache) {
    $scope.atm = ATM;
    $scope.atm.message = "Welcome";
    $scope.atm.submessage = "Please Insert Card";
    $scope.atm.show = false;
    $scope.atm.attempts = "Visit the branch";
    $scope.atm.color = "red";
    $scope.atm.error = true;
    $scope.atm.amountEntered = "";
    $scope.atm.depositAmount = 0;
    $scope.atm.spinner = false;

    $scope.card = CARDREADERService;

    $scope.cancel = function () {
        $scope.atm.message = "Welcome";
        $scope.atm.submessage = "Please Insert Card";
        $scope.card.number = "";
        $location.path('/');
       // $window.location.reload();
    }

    $scope.printBalance = function(name, balance) {
        Printer.printBalance(name, balance);
    }

    $scope.authenticate = function () {
        $scope.atm.spinner = true;
        var result = ATMUi.authenticateCard($scope.card);

        result.then(function (response) {
            if (parseInt(response.data.attempts) == 0) {
                $scope.atm.attempts = "Visit the branch";
                $scope.atm.color = "red";
                $scope.atm.error = true;
            }
            else {
                $scope.atm.attempts = response.data.attempts.toString()+" attempts left";
                $scope.atm.color = "lime";
                $scope.atm.error = false;

                if (response.data.result == true)
                    $location.path('/main').replace();
            }

            $scope.card.pin = "";
            $scope.atm.spinner = false;
        }, function (error) {
            console.log(error);
            $scope.atm.spinner = false;
        });
    }

    $scope.withdraw = function () {
        $scope.atm.spinner = true;
        $location.path('/withdraw');
    }

    $scope.deposit = function () {
        $scope.atm.spinner = true;
        $location.path('/deposit');
    }

    $scope.balance = function () {
        $scope.atm.spinner = true;
        $location.path('/balance');
    }

    $scope.selectAmount = function (amount) {
        $scope.atm.spinner = true;
        $scope.tempAmount = amount;
        $location.path('/finish');
        $scope.atm.spinner = false;
    }

    $scope.finish = function () {
        $scope.atm.spinner = true;
        $scope.withdrawamount($scope.tempAmount);
        $scope.atm.spinner = false;
    }

    $scope.finishDenomination = function (denomination) {
        $scope.atm.spinner = true;
        if (Dispenser.DenominationAvailable(denomination))
            $scope.withdrawamountdenomination($scope.tempAmount, denomination);
        else {
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Warning')
                .textContent('Denomination not available,choose a different one')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK!')
            );
        }
        $scope.atm.spinner = false;
    }

    $scope.enterAmount = function (amount, ev) {
        $scope.atm.spinner = true;
        if (parseInt(amount) % 10 != 0 || parseInt(amount) == 0) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent('Invalid amount, enter multiples of 10')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK!')
                    .targetEvent(ev)
            );
        }
        else {
            $scope.selectAmount(amount);
        }
        $scope.atm.spinner = false;
    }

    $scope.depositAmount = function(amount, ev) {
        $scope.atm.spinner = true;
        if (Depositor.getTotal()!=amount) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent('Amount entered is not equal amount to deposit')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK!')
                    .targetEvent(ev)
            );
        } else if (amount<=0) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Warning')
                    .textContent('Amount on 0 not allowed')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK!')
                    .targetEvent(ev)
            );
        }
        else {
            $scope.atm.spinner = true;
            var result = ATMUi.depositAmount({ Amount: amount });
            result.then(function (response) {
                if (response.data.reply == true) {
                    $location.path('/');
                    $scope.atm.message = "Successful!";
                    $scope.atm.submessage = "Please collect cash, receipt and card";
                    Printer.printDeposit(amount, amount, response.data.balance, response.data.name);
                    Depositor.load();
                } else {
                    $location.path('/');
                    $scope.atm.message = "Failed!";
                    $scope.atm.submessage = "Please collect receipt and card";
                    Printer.printDepositError(amount, 0, response.data.balance, response.data.name);
                }
                $scope.atm.spinner = false;
            }, function (error) {
                console.log(error);
                $scope.atm.spinner = false;
            });
        }
        
        $scope.atm.spinner = false;
    }

    $scope.withdrawamountdenomination = function (amount, denomination) {
        $scope.atm.spinner = true;
        Dispenser.takeOutDenomination(amount, denomination);
        var statusDispenser = Dispenser.validate();
        var result = ATMUi.withdrawAmount({ Amount: amount, Status: statusDispenser });
        result.then(function (response) {
            if (response.data.reply == true) {
                Dispenser.money.amount = "";
                Dispenser.validate();
                
                $location.path('/');
                
                if (statusDispenser) {
                    $scope.atm.message = "Successful!";
                    $scope.atm.submessage = "Please collect cash, receipt and card";

                    Printer.print(amount, amount, response.data.balance, response.data.name);
                } else {
                    $scope.atm.message = "Unsuccessful!";
                    $scope.atm.submessage = "failed to dispense money, choose different amount";

                    Printer.printFail(amount, 0, response.data.balance, response.data.name);
                }
                
                Dispenser.showMoney();
                $scope.atm.spinner = false;
            }
            else {
                $location.path('/');
                $scope.atm.message = "Failed!";
                $scope.atm.submessage = "Please collect receipt and card";

                Printer.printError(amount, 0, response.data.balance, response.data.name);
                $scope.atm.spinner = false;
            }
        }, function (error) {
            console.log(error);
            $scope.atm.spinner = false;
        });
    }

    $scope.withdrawamount = function (amount) {
        $scope.atm.spinner = true;
        Dispenser.takeOutMoney(amount);
        var statusDispenser = Dispenser.validate();
        var result = ATMUi.withdrawAmount({ Amount: amount, Status: statusDispenser });
        result.then(function (response) {
            if (response.data.reply == true) {
                Dispenser.money.amount = "";
                
                $location.path('/');
               
                if (statusDispenser) {
                    $scope.atm.message = "Successful!";
                    $scope.atm.submessage = "Please collect cash, receipt and card";

                    Printer.print(amount, amount, response.data.balance, response.data.name);
                } else {
                    $scope.atm.message = "Unsuccessful!";
                    $scope.atm.submessage = "failed to dispense money, choose different amount";

                    Printer.printFail(amount, 0, response.data.balance, response.data.name);
                }

                Dispenser.showMoney();
                $scope.atm.spinner = false;
            }
            else {
                $location.path('/');
                $scope.atm.message = "Failed!";
                $scope.atm.submessage = "Please collect receipt and card";

                Printer.printError(amount, 0, response.data.balance, response.data.name);
                $scope.atm.spinner = false;
            }
        }, function (error) {
            console.log(error);
            $scope.atm.spinner = false;
        });
    }

    $scope.withdrawfrom = function (account) {
        $scope.atm.spinner = true;
        var result = ATMUi.choosenAccount({ Account: account });
        result.then(function (response) {
            if (response.data==account)
                $location.path('/chooseamount');
            $scope.atm.spinner = false;
        }, function (error) {
            console.log(error);
            $scope.atm.spinner = false;
        });
    }

    $scope.depositOn = function (account) {
        $scope.atm.spinner = true;
        var result = ATMUi.choosenAccount({ Account: account });
        result.then(function (response) {
            if (response.data == account) {
                $location.path('/choosedeposit');
                $scope.atm.depositAmount = 0;
            }
            $scope.atm.spinner = false;
        }, function (error) {
            console.log(error);
            $scope.atm.spinner = false;
        });
    }

    $scope.balanceOn = function(account) {
        $scope.atm.spinner = true;
        var result = ATMUi.choosenAccount({ Account: account });
        result.then(function (response) {
            if (response.data == account) {
                $location.path('/viewbalance');
            }
            $scope.atm.spinner = false;
        }, function (error) {
            console.log(error);
            $scope.atm.spinner = false;
        });
    }

    $scope.back = function() {
        $window.history.back();
    }

    $scope.$on('$routeChangeStart', function (scope, next, current) {
        $scope.atm.spinner = true;
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });

    $scope.$on('$routeChangeSuccess', function (scope, next, current) {
        $scope.atm.spinner = false;
    });
}