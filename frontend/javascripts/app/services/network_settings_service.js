window.ChaiBioTech.ngApp.service('NetworkSettingsService',[
  '$rootScope',
  '$http',
  '$q',
  'host',
  function($rootScope, $http, $q, host) {
    var that = this;
    this.connectedWifiNetwork = {};

    this.getWifiNetworks = function() {
      var delay = $q.defer();
      $http.get(host + ':8000/network/wlan/scan').then(function(data) {
        delay.resolve(data);
      }, function(err) {
        delay.reject(err);
      });
      return delay.promise;
    };

    this.getSettings = function() {
      var delay = $q.defer();
      $http.get(host + ':8000/network/wlan').then(function(result) {
        that.connectedWifiNetwork = result.data;
        $rootScope.$broadcast("new_wifi_connected");
        delay.resolve(result);
      }, function(err) {
        delay.reject(err);
      });

      return delay.promise;
    };

    this.connectWifi = function() {
      console.log("dddd dddd dddd");

    };
  }
]);
