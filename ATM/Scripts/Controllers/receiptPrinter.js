var receiptPrinter = angular.module("my-receipt-printer", []);

receiptPrinter.controller("receiptCtrl", receiptCtrl);

receiptPrinter.service('Printer', function () {
    this.receipt = {};

    this.print = function (amount,dispensed, balance, account) {
        this.receipt.text = "SUCCESSFUL :)\n\nREQUESTED AMOUNT\t: R" + amount + "\n" + "DISPENSED AMOUNT\t: R" + dispensed + "\n" + "FROM ACCOUNT\t: " + account + "\n\n"
                           + "TOTAL AMOUNT\t: R" + dispensed + "\n"
                           + "BALANCE\t: R" + balance + "\n";
    }

    this.printFail = function (amount, dispensed, balance, account) {
        this.receipt.text = "UNSUCCESSFUL :(\n\nREQUESTED AMOUNT\t: R" + amount + "\n" + "DISPENSED AMOUNT\t: R" + dispensed + "\n" + "FROM ACCOUNT\t: " + account + "\n\n"
                           + "TOTAL AMOUNT\t: R" + dispensed + "\n"
                           + "BALANCE\t: R" + balance + "\n";
    }

    this.printError = function (amount, dispensed, balance, account)
    {
        this.receipt.text = "FAILED :(\n\nREQUESTED AMOUNT\t: R" + amount + "\n" + "DISPENSED AMOUNT\t: R" + dispensed + "\n" + "FROM ACCOUNT\t: " + account + "\n\n"
                           + "TOTAL AMOUNT\t: R" + dispensed + "\n"
                           + "BALANCE\t: R" + balance + "\n";
    }

    this.printDeposit = function(amount, deposited, balance, account) {
        this.receipt.text = "SUCCESSFUL :)\n\nDEPOSITED AMOUNT\t: R" +
            amount +
            "\nCOLLECTED AMOUNT\t: R" +
            deposited +
            "\nFROM ACCOUNT\t: " +
            account +
            "\n\n" +
            "TOTAL AMOUNT\t: R" +
            deposited +
            "\n" +
            "BALANCE\t: R" +
            balance +
            "\n";
    }

    this.printDepositError = function (amount, deposited, balance, account) {
        this.receipt.text = "UNSUCCESSFUL :)\n\nDEPOSITED AMOUNT\t: R" +
            amount +
            "\nCOLLECTED AMOUNT\t: R" +
            deposited +
            "\nFROM ACCOUNT\t: " +
            account +
            "\n\n" +
            "TOTAL AMOUNT\t: R" +
            deposited +
            "\n" +
            "BALANCE\t: R" +
            balance +
            "\n";
    }

    this.printBalance = function(account, balance) {
        this.receipt.text = "SUCCESSFUL :)\n\nFROM ACCOUNT\t: " +
            account +
            "\n\n" +
            "BALANCE\t: R" +
            balance +
            "\n";
    }

    this.collect = function() {
        this.receipt.text = "";
    }
});

function receiptCtrl(Printer,$scope) {
    $scope.receipt = Printer.receipt;
    $scope.collect = Printer.collect;
}