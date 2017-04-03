var cashDepositor = angular.module("my-cash-depositor", ["my-cash-dispenser"]);

cashDepositor.controller("cashDepCtrl", cashDepCtrl);

cashDepositor.service('Depositor', function () {
    this.money = {};
    this.money.ten = 0;
    this.money.twenty = 0;
    this.money.fifty = 0;
    this.money.hundred = 0;
    this.money.twohundred = 0;
    this.Dispenser = null;

    this.getTotal = function() {
        return parseInt(this.money.ten)*10 +
                parseInt(this.money.twenty)*20 +
                parseInt(this.money.fifty)*50 +
                parseInt(this.money.hundred)*100 +
                parseInt(this.money.twohundred)*200;
    }
    this.clear = function() {
        this.money.ten = 0;
        this.money.twenty = 0;
        this.money.fifty = 0;
        this.money.hundred = 0;
        this.money.twohundred = 0;
    }

    this.setDispenser = function(dispenser) {
        this.Dispenser = dispenser;
    }
    this.load = function() {
        this.Dispenser.money.tens += this.money.ten;
        this.Dispenser.money.twenties += this.money.twenty;
        this.Dispenser.money.fifties += this.money.fifty;
        this.Dispenser.money.hundreds += this.money.hundred;
        this.Dispenser.money.twohundreds += this.money.twohundred;
        this.clear();
    }
});

function cashDepCtrl(Depositor, $scope, Dispenser) {
    $scope.money = Depositor.money;
    Depositor.setDispenser(Dispenser);
}