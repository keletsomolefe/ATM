var cardReader = angular.module("my-card-reader", ["my-app"]);

cardReader.controller("cardCtrl", cardCtrl);

cardReader.factory('cardReader',function($http) {
    return {
        insertCard: function (data) {
            return $http.post('/BSL/InsertCard', { CardNumber: data });
        }
    };
});

cardReader.service('CARDREADERService', function () {
    return {};
});

function cardCtrl($scope, cardReader, ATM, CARDREADERService,$location,$window) {
    $scope.atm = ATM;

    $scope.card = CARDREADERService;

    $scope.card.number = "";

    $scope.collectCard = function () {
        $scope.atm.message = "Welcome";
        $scope.atm.submessage = "Please Insert Card";
        $scope.card.number = "";
        $location.path('/');
       // var el = angular.element('#test');
        //el.attr('disabled', '');
        //$window.location.reload();
    }

    $scope.insertCard = function () {
       // var el = angular.element('#test');
        //el.attr('disabled', 'disabled');
        $scope.atm.spinner = true;
        var result = cardReader.insertCard($scope.card.number);
        
        result.then(function (response) {
            $scope.atm.attempts = response.data.attempts;
            if (response.data.result == true && parseInt(response.data.attempts) == 0) {
                $scope.atm.attempts = "Visit the branch";
                $scope.atm.color = "red";
                $scope.atm.error = true;
                $location.path('/authenticate');
            } else if (response.data.result == true) {
                $scope.atm.attempts = response.data.attempts.toString() + " attempts left";
                $scope.atm.color = "lime";
                $scope.atm.error = false;
                $location.path('/authenticate');
            }
            else {
                if (response.data.message == "reported") {
                    $scope.atm.message = "Card Reported";
                    $scope.atm.submessage = "Card retained";
                    $scope.atm.show = true;
                } else {
                    $scope.atm.message = "Card Error";
                    $scope.atm.submessage = "Card Rejected";
                    $scope.atm.show = true;
                }
            }
            $scope.atm.spinner = false;
        }, function (error) {
            $scope.atm.spinner = false;
            console.log(error.data);
        });
    }
}