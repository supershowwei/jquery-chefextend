(function ($) {
    $.extend({
        http: {
            beforeSend: function (func) {
                if (func) func();

                return this;
            },
            get: function (url) {
                return $.ajax(url, { method: "GET" });
            },
            post: function (url, data) {
                if (data.constructor === FormData) {
                    return $.ajax(url, { method: "POST", data: data, cache: false, contentType: false, processData: false });
                } else {
                    return $.ajax(url, { method: "POST", data: data });
                }
            },
            put: function (url, data) {
                return $.ajax(url, { method: "PUT", data: data });
            },
            patch: function (url, data) {
                return $.ajax(url, { method: "PATCH", data: data });
            },
            delete: function (url) {
                return $.ajax(url, { method: "DELETE" });
            }
        }
    });
})(jQuery);