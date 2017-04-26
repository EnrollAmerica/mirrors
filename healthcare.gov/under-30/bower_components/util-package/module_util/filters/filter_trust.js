(function () {
var util = angular.module('Util');

util.filter('trust', ['$sce', function ($sce) {
    return $sce.trustAsHtml;
}]);
})();