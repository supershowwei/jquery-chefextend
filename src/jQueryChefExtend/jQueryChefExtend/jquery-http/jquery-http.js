(function ($) {
    var _http = {
        default: {
            settings: {}
        }
    };

    _http.beforeSend = function (func) {
        if (func) func();

        return this;
    }

    _http.get = function (url, settings) {
        var defaultSettings = typeof _http.default.settings === "function" ? _http.default.settings() : _http.default.settings;

        settings = $.extend(true, {}, defaultSettings, settings);
        settings.method = "GET";

        return $.ajax(url, settings);
    }

    _http.post = function (url, data, settings) {
        var defaultSettings = typeof _http.default.settings === "function" ? _http.default.settings() : _http.default.settings;

        settings = $.extend(true, {}, defaultSettings, settings);
        settings.method = "POST";
        settings.data = data;

        if (data.constructor === FormData) {
            settings.cache = false;
            settings.contentType = false;
            settings.processData = false;

            return $.ajax(url, settings);
        }

        return $.ajax(url, settings);
    }

    _http.put = function (url, data, settings) {
        var defaultSettings = typeof _http.default.settings === "function" ? _http.default.settings() : _http.default.settings;

        settings = $.extend(true, {}, defaultSettings, settings);
        settings.method = "PUT";
        settings.data = data;

        return $.ajax(url, settings);
    }

    _http.patch = function (url, data, settings) {
        var defaultSettings = typeof _http.default.settings === "function" ? _http.default.settings() : _http.default.settings;

        settings = $.extend(true, {}, defaultSettings, settings);
        settings.method = "PATCH";
        settings.data = data;

        return $.ajax(url, settings);
    }

    _http.delete = function (url, settings) {
        var defaultSettings = typeof _http.default.settings === "function" ? _http.default.settings() : _http.default.settings;

        settings = $.extend(true, {}, defaultSettings, settings);
        settings.method = "DELETE";

        return $.ajax(url, settings);
    }

    $.extend({ http: _http });
})(jQuery);