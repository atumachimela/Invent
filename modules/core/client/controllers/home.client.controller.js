'use strict';

angular.module('core').controller('HomeController', ['$translate', '$scope', 'Authentication',
  function ($translate, $scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);
