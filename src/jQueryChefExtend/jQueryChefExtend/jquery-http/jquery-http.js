(function ($) {
    var isPromise = function (obj) {
        if (typeof obj === "object" && typeof obj.then !== "function") {
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
        return (isPromise(_http.default.settings) ? _http.default.settings : $.Deferred().resolve(_http.default.settings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "GET";
            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    _http.post = function (url, data, settings) {
        return (isPromise(_http.default.settings) ? _http.default.settings : $.Deferred().resolve(_http.default.settings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "POST";
            settings.data = data;

            if (data.constructor === FormData) {
                settings.cache = false;
                settings.contentType = false;
                settings.processData = false;

                return $.ajax(typeof url === "function" ? url() : url, settings);
            }

            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    _http.put = function (url, data, settings) {
        return (isPromise(_http.default.settings) ? _http.default.settings : $.Deferred().resolve(_http.default.settings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "PUT";
            settings.data = data;

            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    _http.patch = function (url, data, settings) {
        return (isPromise(_http.default.settings) ? _http.default.settings : $.Deferred().resolve(_http.default.settings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "PATCH";
            settings.data = data;

            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    _http.delete = function (url, settings) {
        return (isPromise(_http.default.settings) ? _http.default.settings : $.Deferred().resolve(_http.default.settings).promise()).then(function (defaultSettings) {
            settings = $.extend(true, {}, defaultSettings, settings);
            settings.method = "DELETE";

            return $.ajax(typeof url === "function" ? url() : url, settings);
        });
    }

    $.extend({ http: _http });
})(jQuery);