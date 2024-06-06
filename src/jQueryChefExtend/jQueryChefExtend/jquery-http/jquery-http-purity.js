(function ($) {
    var isJSON = (function () {
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

    var _http = {};

    _http.get = function (url, settings) {
        if (typeof url === "function") url = url();
        if (!(settings)) settings = {};

        settings.method = "GET";

        return $.ajax(url, settings);
    }

    _http.post = function (url, data, settings) {
        if (typeof url === "function") url = url();
        if (!(settings)) settings = {};

        settings.method = "POST";
        settings.data = data;

        if (typeof data === "string" && isJSON.call(data)) {
            settings.contentType = "application/json; charset=utf-8";
        }

        if (data && data.constructor === FormData) {
            settings.cache = false;
            settings.contentType = false;
            settings.processData = false;

            return $.ajax(url, settings);
        }

        return $.ajax(url, settings);
    }

    _http.put = function (url, data, settings) {
        if (typeof url === "function") url = url();
        if (!(settings)) settings = {};

        settings.method = "PUT";
        settings.data = data;

        return $.ajax(url, settings);
    }

    _http.patch = function (url, data, settings) {
        if (typeof url === "function") url = url();
        if (!(settings)) settings = {};

        settings.method = "PATCH";
        settings.data = data;

        return $.ajax(url, settings);
    }

    _http.delete = function (url, settings) {
        if (typeof url === "function") url = url();
        if (!(settings)) settings = {};

        settings.method = "DELETE";

        return $.ajax(url, settings);
    }

    $.extend({ http: _http });
})(jQuery);