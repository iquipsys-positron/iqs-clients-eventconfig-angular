(function () {

    var config = {
        "session": {
            "serverUrl": "/",
            "authorizedState": "app.rules",
            "unautorizedState": "landing"
        }
    };

    angular
        .module('iqsShellRuntimeConfig', ['pipCommonRest', 'pipErrors', 'pipErrors.Unauthorized'])
        .constant('SHELL_RUNTIME_CONFIG', config);
})();
