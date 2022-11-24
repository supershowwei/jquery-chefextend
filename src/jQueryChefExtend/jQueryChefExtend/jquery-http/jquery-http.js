if (!String.prototype.isJSON) {
    String.prototype.isJSON = (function () {
        var rx_one = /^[\],:{}\s]*$/;
        var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

        return function () {
            return rx_one.test(
                this
                    .replace(rx_two, "@")
                    .replace(rx_three, "]")
                    .replace(rx_four, ""));
        }
    })();
}

(function ($) {
    var isPromise = function (obj) {
        if (typeof obj === "undefined" || (typeof obj === "object" && typeof obj.then !== "function")) {
            return false;
        }
        return String(obj.then) === String($.Deferred().then);
    }

    var _defaultSettings;
    var _http = {
        default: {
            get settings() {
                return typeof _defaultSettings === "function" ? _defaultSettings() : _defaultSettings;
            },
            set settings(val) {
                _defaultSettings = val;
            }
        }
    };

    _http.get = function (url, settings) {
        var defaultSettings = _http.default.settings;

        return (isPromise(defaultSettings) ? defaultSettings : $.Deferred().resolve(defaultSettings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "GET";
            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    _http.post = function (url, data, settings) {
        var defaultSettings = _http.default.settings;

        return (isPromise(defaultSettings) ? defaultSettings : $.Deferred().resolve(defaultSettings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "POST";
            settings.data = data;

            if (typeof data === "string" && data.isJSON()) {
                settings.contentType = "application/json; charset=utf-8";
            }

            if (data && data.constructor === FormData) {
                settings.cache = false;
                settings.contentType = false;
                settings.processData = false;

                return $.ajax(typeof url === "function" ? url() : url, settings);
            }

            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    _http.put = function (url, data, settings) {
        var defaultSettings = _http.default.settings;

        return (isPromise(defaultSettings) ? defaultSettings : $.Deferred().resolve(defaultSettings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "PUT";
            settings.data = data;

            if (typeof data === "string" && data.isJSON()) {
                settings.contentType = "application/json; charset=utf-8";
            }

            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    _http.patch = function (url, data, settings) {
        var defaultSettings = _http.default.settings;

        return (isPromise(defaultSettings) ? defaultSettings : $.Deferred().resolve(defaultSettings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "PATCH";
            settings.data = data;

            if (typeof data === "string" && data.isJSON()) {
                settings.contentType = "application/json; charset=utf-8";
            }

            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    _http.delete = function (url, settings) {
        var defaultSettings = _http.default.settings;

        return (isPromise(defaultSettings) ? defaultSettings : $.Deferred().resolve(defaultSettings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "DELETE";

            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    $.extend({ http: _http });
})(jQuery);