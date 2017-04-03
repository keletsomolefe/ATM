var cashDispenser = angular.module("my-cash-dispenser", []);

cashDispenser.controller("cashCtrl", cashCtrl);

cashDispenser.service('Dispenser', function () {
    this.amount = 0;
    this.money = {};
    this.money.tens = 1000;
    this.money.twenties = 500;
    this.money.fifties = 200;
    this.money.hundreds = 100;
    this.money.twohundreds = 50;

    this.tempTens = 0;
    this.tempTwenties = 0;
    this.tempFifties = 0;
    this.tempHundreds = 0;
    this.tempTwohundeds = 0;

    this.DenominationAvailable = function(denomination) {
        if (denomination == 10)
            return (this.money.tens > 0);
        else if (denomination == 20)
            return (this.money.twenties > 0);
        else if (denomination == 50)
            return (this.money.fifties > 0);
        else if (denomination == 100)
            return (this.money.hundreds > 0);
        else if (denomination == 200)
            return (this.money.twohundreds > 0);
        else return false;
    }

    this.requestAmount = function(amount) {
        this.amount = amount;
    }

    this.get = function (note) {
        var count = Math.floor(this.amount / note);
        this.amount -= count * note;

        if (note == 10) {
            if (count > this.money.tens) {
                this.amount = this.amount + 10 * (count - this.money.tens);
                count = this.money.tens;
            }
            //this.money.tens -= count;
            this.tempTens = count;
        }
        else if (note == 20) {
            if (count > this.money.twenties) {
                this.amount = this.amount + 20 * (count - this.money.twenties);
                count = this.money.twenties;
            }
            
            //this.money.twenties -= count;
            this.tempTwenties = count;
        }
        else if (note == 50) {
            if (count > this.money.fifties) {
                this.amount = this.amount + 50 * (count - this.money.fifties);
                count = this.money.fifties;
            }
            //this.money.fifties -= count;
            this.tempFifties = count;
        }
        else if (note == 100) {
            if (count > this.money.hundreds) {
                this.amount = this.amount + 100 * (count - this.money.hundreds);
                count = this.money.hundreds;
            }
            //this.money.hundreds -= count;
            this.tempHundreds = count;
        }
        else if (note == 200) {
            if (count > this.money.twohundreds) {
                this.amount = this.amount + 200 * (count - this.money.twohundreds);
                count = this.money.twohundreds;
            }
            //this.money.twohundreds -= count;
            this.tempTwohundeds = count;
        }

        return this;
    }

    this.validate = function() {
        if (this.amount == 0) {
            this.money.tens -= this.tempTens;
            this.money.twenties -= this.tempTwenties;
            this.money.fifties -= this.tempFifties;
            this.money.hundreds -= this.tempHundreds;
            this.money.twohundreds -= this.tempTwohundeds;

            return true;
        }
        else {
            this.money.tens += this.tempTens;
            this.money.twenties += this.tempTwenties;
            this.money.fifties += this.tempFifties;
            this.money.hundreds += this.tempHundreds;
            this.money.twohundreds += this.tempTwohundeds;

            return false;
        }
    }

    this.showMoney = function () {
        this.money.amount = "";
        this.money.amount += "Dispensed " + this.tempTens + " R10 notes\n";
        this.money.amount += "Dispensed " + this.tempTwenties + " R20 notes\n";
        this.money.amount += "Dispensed " + this.tempFifties + " R50 notes\n";
        this.money.amount += "Dispensed " + this.tempHundreds + " R100 notes\n";
        this.money.amount += "Dispensed " + this.tempTwohundeds + " R200 notes\n";
    }

    this.takeOutMoney = function (amount) {
        this.amount = amount;
        this.tempTens = 0;
        this.tempTwenties = 0;
        this.tempFifties = 0;
        this.tempHundreds = 0;
        this.tempTwohundeds = 0;

        this.get(200).get(100).get(50).get(20).get(10);
    }

    this.takeOutDenomination = function (amount, denomination) {
        this.amount = amount;
        if (denomination==10)
            this.get(denomination).get(200).get(100).get(50).get(20);
        else if (denomination == 20)
            this.get(denomination).get(200).get(100).get(50).get(10);
        else if (denomination == 50)
            this.get(denomination).get(200).get(100).get(20).get(10);
        else if (denomination == 100)
            this.get(denomination).get(200).get(50).get(20).get(10);
        else if (denomination == 200)
            this.get(denomination).get(100).get(50).get(20).get(10);
    }
});

function cashCtrl(Dispenser, $scope) {
    $scope.money = Dispenser.money;
    $scope.money.amount = "";
    Dispenser.takeOutMoney(0);
    Dispenser.showMoney();

    $scope.collect = function() {
        $scope.money.amount = "";
        Dispenser.takeOutMoney(0);
        Dispenser.showMoney();
    }
}