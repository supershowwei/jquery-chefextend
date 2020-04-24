(function ($) {
    $.extend({
        http: {
            beforeSend: function (func) {
                if (func) func();

                return this;
            },
            get: function (url, settings) {
                if (!(settings)) settings = {};
                    
                settings.method = "GET";

                return $.ajax(url, settings);
            },
            post: function (url, data, settings) {
                if (!(settings)) settings = {};
                    
                settings.method = "POST";
                settings.data = data;

                if (data.constructor === FormData) {
                    settings.cache = false;
                    settings.contentType = false;
                    settings.processData = false;

                    return $.ajax(url, settings);
                }

                return $.ajax(url, settings);
            },
            put: function (url, data, settings) {
                if (!(settings)) settings = {};
                    
                settings.method = "PUT";
                settings.data = data;

                return $.ajax(url, settings);
            },
            patch: function (url, data, settings) {
                if (!(settings)) settings = {};
                    
                settings.method = "PATCH";
                settings.data = data;

                return $.ajax(url, settings);
            },
            delete: function (url, settings) {
                if (!(settings)) settings = {};
                    
                settings.method = "DELETE";

                return $.ajax(url, settings);
            }
        }
    });
})(jQuery);